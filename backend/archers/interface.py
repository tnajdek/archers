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


class Connection(EventsMixins):
	def __init__(self, world):
		super(Connection, self).__init__()
		self.session_id = uuid.UUID(bytes=urandom(16))
		self.world = world
		self.known = dict()
		self.last_world_index = 0
		self.last_frame_index = 0
		self.archer = Archer(self.world, player=self)

		self.meta = {
			"id": self.archer.id,
			"username": "Unnamed",
			"kills": 0,
			"deaths": 0,
			"score": 0
		}

		logging.info("New connection %s" % self.session_id)

		self.world.on('destroy_object', self.on_destroy)
		self.world.on('step', self.on_update)
		self.world.on('step', self.frame_maybe)
		self.on('useraction', self.on_user_action)
		self.on('disconnect', self.on_disconnect)
		self.on('metamsg', self.on_metamsg)
		self.on('kill', self.on_kill)
		self.on('die', self.on_die)
		self.on('mob', self.on_mob)

	def on_kill(self, prey):
		self.meta['kills'] = self.meta['kills'] + 1
		self.meta['score'] = self.meta['score'] + settings.score['kill']
		logging.info("%s fragged %s" % (self.meta['username'], prey.meta['username']))
		self.trigger('meta', self.meta)

	def on_die(self, killer=None):
		self.meta['deaths'] = self.meta['deaths'] + 1
		self.trigger('meta', self.meta)

	def on_mob(self):
		self.meta['score'] = self.meta['score'] + settings.score['mob']
		self.trigger('meta', self.meta)

	def on_metamsg(self, meta):
		if('username' in meta):
			new_username = meta['username'][0:10]
			if(new_username != self.meta['username']):
				self.meta['username'] = new_username
				logging.info("%s is now known as %s" % (self.session_id, self.meta['username']))
				self.trigger('meta', self.meta)

	def on_disconnect(self):
		self.archer.destroy()

	def on_user_action(self, message):
		spawn_points = self.world.get_spawn_points()
		shuffle(spawn_points)
		if(message['action'] == 'spawn'):
			self.archer.spawn(spawn_points[0])
		if(message['action'] == 'stop'):
			self.archer.want_stop()
		if(message['action'] == 'move'):
			self.archer.want_move(message['direction'])
		if(message['action'] == 'attack'):
			self.archer.want_attack(message['direction'])

	def on_update(self, world):
		if(self.last_world_index != world.object_index.index):
			messages = list()
			for index in range(self.last_world_index, world.object_index.index):
				index = index+1
				try:
					world_object = world.get_object_by_id(index)
					if(hasattr(world_object, 'get_update_message')):
						msg = world_object.get_update_message(recipient=self)
						if(msg):
							messages.append(msg)
				except KeyError:
					# this object has been destroyed by now, so we don't care
					pass
				self.last_world_index = index
			self.trigger('update', messages)

	def on_destroy(self, world_object):
		messages = list()
		if(hasattr(world_object, 'get_destroy_message')):
			msg = world_object.get_destroy_message(recipient=self)
			if(msg):
				messages.append(msg)
		self.trigger('remove', messages)

	def frame_maybe(self, world):
		self.trigger('frame', self.get_frame())

	def get_frame(self, updated_only=True):
		update = list()

		for item in self.world.object_index.values():
			if(hasattr(item, 'get_frame_message')):
				data = item.get_frame_message(recipient=self)
				if data and not(item in self.known.keys() and self.known[item] == data):
					update.append(data)
					self.known[item] = data
		return update


def pack_messages(messages):
	if(len(messages) == 0):
		return ''

	buffer_ = struct.pack('B', messages[0].schema['id'])
	for message in messages:
		if(message and hasattr(message, 'pack')):
			buffer_ += message.pack()
	return buffer_


def unpack_mesages(data):
	buffer_ = buffer(data)
	messages = list()
	message_cls = message_types[struct.unpack('B', buffer_[0])[0]]
	message_count = (len(buffer_)-1)/message_cls.get_byte_length()
	for i in range(message_count):
		msg_buffer = buffer_[1+i*message_cls.get_byte_length():1+(i+1)*message_cls.get_byte_length()]
		messages.append(message_cls.from_packed(msg_buffer))
	return messages
