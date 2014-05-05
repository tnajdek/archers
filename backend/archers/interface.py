from archers.utils import EventsMixins
from archers.messages import message_types, UpdateMessage, FrameMessage, RemoveMessage
import struct
from archers.utils import m2p, limit
from archers.archer import Archer
from random import shuffle
import uuid
from os import urandom
import logging
import settings
from archers.items import verify_slots


class Connection(EventsMixins):

	def __str__(self):
		return self.meta['username'];

	def __init__(self, world, cache):
		super(Connection, self).__init__()
		self.session_id = uuid.UUID(bytes=urandom(16))
		self.world = world
		self.cache = cache
		self.known = dict()
		self.last_world_index = 0
		self.last_frame_index = 0
		self.archer = Archer(self.world, player=self)

		self.meta = {
			"id": self.archer.id,
			"username": "Unnamed",
			"gender": "male",
			"slots": {},
			"kills": 0,
			"deaths": 0,
			"score": 0,
			"budget": settings.initial_budget,
			"attributes": self.archer.attributes
		}

		self.archer.interface = self

		logging.info("New connection %s" % self.session_id)

		self.world.on('destroy_object', self.on_destroy)
		self.world.on('step', self.on_step)
		self.on('useraction', self.on_user_action)
		self.on('disconnect', self.on_disconnect)
		self.on('usermsg', self.on_user_message)
		self.on('kill', self.on_kill)
		self.on('die', self.on_die)
		self.on('mob', self.on_mob)
		self.on('pickup', self.on_pickup)
		self.on('spawn', self.on_spawn)


	def on_spawn(self):
		self.meta['budget'] = settings.initial_budget
		self.trigger('meta', self.meta)

	def on_kill(self, prey):
		self.meta['kills'] = self.meta['kills'] + 1
		self.meta['score'] = self.meta['score'] + settings.score['kill']
		logging.info("%s fragged %s" % (self.meta['username'], prey.meta['username']))
		self.trigger('meta', self.meta)

	def on_die(self, killer=None):
		self.meta['deaths'] = self.meta['deaths'] + 1
		logging.info("%s died by the hand of %s" % (self.meta['username'], killer or "[unknown]"))
		self.trigger('meta', self.meta)

	def on_mob(self):
		self.meta['score'] = self.meta['score'] + settings.score['mob']
		self.trigger('meta', self.meta)

	def on_pickup(self, bonus):
		self.meta['budget'] = self.meta["budget"] + bonus.value
		self.trigger('meta', self.meta)

	def on_user_message(self, meta):
		changed = False
		if('username' in meta):
			new_username = meta['username'][0:10]
			if(new_username != self.meta['username']):
				self.meta['username'] = new_username
				logging.info("%s is now known as %s" % (self.session_id, self.meta['username']))
				changed = True
				
		if('gender' in meta and meta['gender'] != self.meta['gender']):
			self.meta['gender'] = meta['gender']
			changed = True

		if('slots' in meta and meta['slots'] != self.meta['slots']):
			if(verify_slots(meta['slots'], self.meta['budget'])):
				self.meta['slots'] = meta['slots']
				changed = True
			else:
				logging.info("%s provided incorrect meta msg (%s). Discarding" 
					% (self.meta['username'], meta['slots']))

		if(changed):
			self.archer.update_attributes()
			# self.trigger('meta', self.meta)


	def on_disconnect(self):
		self.world.off('destroy_object', self.on_destroy)
		self.world.off('step', self.on_step)
		self.off()
		self.archer.destroy()

	def on_user_action(self, message):
		spawn_points = self.world.get_spawn_points()
		shuffle(spawn_points)
		if(message['action'] == 'spawn'):
			if(not self.archer.is_alive()):
				if(verify_slots(self.meta['slots'], self.meta['budget'])):
					self.archer.spawn(spawn_points[0])
				else:
					logging.info('denying %s spawn, incorrect slots %s' % (self.meta['username'], self.meta['slots']))
			else:
				pass
				# logging.warn('got spawn while user is alive! Kill!')
				# self.archer.kill()
		if(message['action'] == 'stop'):
			self.archer.want_stop()
		if(message['action'] == 'move'):
			self.archer.want_move(message['direction'])
		if(message['action'] == 'attack'):
			self.archer.want_attack(message['direction'])


	def on_destroy(self, world_object):
		messages = list()
		if(hasattr(world_object, 'get_destroy_message')):
			msg = world_object.get_destroy_message()
			if(msg):
				messages.append(msg)
		self.trigger('remove', messages)


	def on_step(self, world):
		self.trigger('update', self.get_update())
		self.trigger('frame', self.get_frame())

	def get_update(self):
		messages = list()
		if(self.last_world_index != self.world.object_index.index):
			for index in range(self.last_world_index, self.world.object_index.index):
				index = index+1
				try:
					world_object = self.world.get_object_by_id(index)
					if(hasattr(world_object, 'get_update_message')):
						msg = world_object.get_update_message(recipient=self)
						if(msg):
							messages.append(msg)
				except KeyError:
					pass
			self.last_world_index = index
		return messages

	def get_frame(self):
		items = self.world.object_index.values()
		update = self.cache.get_frame_message_from_cache(self.world.step)
		if(update):
			return update

		update = list()
		for item in items:
			if(hasattr(item, 'get_frame_message')):
				data = item.get_frame_message()
				update.append(data)
				# if data and not(item in self.known.keys() and self.known[item] == data):
					# self.known[item] = data
		self.cache.cache_frame_messages(self.world.step, update)
		return update


def pack_messages(messages):
	if(len(messages) == 0):
		return ''

	buffer_ = struct.pack('B', messages[0].schema['id'])
	for message in messages:
		if(message and hasattr(message, 'pack')):
			buffer_ += message.pack()
	return buffer_


def unpack_mesages(data, message_types=message_types):
	buffer_ = buffer(data)
	messages = list()
	message_cls = message_types[struct.unpack('B', buffer_[0])[0]]
	message_count = (len(buffer_)-1)/message_cls.get_byte_length()
	for i in range(message_count):
		msg_buffer = buffer_[1+i*message_cls.get_byte_length():1+(i+1)*message_cls.get_byte_length()]
		messages.append(message_cls.from_packed(msg_buffer))
	return messages


class MessageCache(object):
	""" This class will cache commonly sent messages """
	def __init__(self, world):
		self.reset()
		world.on('step', self.on_step)

	def reset(self):
		self.counter = 0
		self.update_messages_cache = dict()
		self.frame_messages_cache = dict()

	def on_step(self, world):
		self.counter = self.counter+1
		if(self.counter > 3):
			self.reset()

	# Stupid update messages are user-specific. fix me?

	# def get_update_message_from_cache(last_known_index):
	# 	if last_known_index in self.update_messages_cache:
	# 		print 'hit'
	# 		return self.update_messages_cache[last_known_index]
	# 	else:
	# 		print 'miss'

	# def cache_update_messages(last_known_index, messages):
	# 	self.update_messages_cache[last_known_index] = messages

	def get_frame_message_from_cache(self, last_known_index):
		if last_known_index in self.frame_messages_cache:
			return self.frame_messages_cache[last_known_index]

	def cache_frame_messages(self, last_known_index, messages):
		self.frame_messages_cache[last_known_index] = messages
