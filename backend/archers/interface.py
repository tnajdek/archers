from archers.utils import EventsMixins
from archers.world import rotations
import struct

# B	unsigned char	integer	1	(3)
# ?	_Bool	bool	1	(1)
# H	unsigned short	integer	2	(3)
# I	unsigned int	integer	4	(3)
# Q	unsigned long long	integer	8	(2), (3)
# f	float


class Message(dict):
	def __init__(self, *args, **kwargs):
		if(args):
			self.hydrate(args[0])

	def dehydrate(self):
		dehydrated = list()
		for key in self.schema['format']:
			value = self.get(key, 0)
			if(hasattr(self, 'dehydrate_%s' % key)):
				hydrator = getattr(self, 'dehydrate_%s' % key)
				if(hasattr(hydrator, '__call__')):
					value = hydrator(value)
			dehydrated.append(value)
		return dehydrated

	def pack(self):
		dehydrated = self.dehydrate()
		buffer_ = struct.pack(self.schema['byteformat'], *dehydrated)
		return buffer_

	@classmethod
	def from_packed(cls, data):
		buffer_ = buffer(data)
		item = struct.unpack_from(cls.schema['byteformat'], buffer_)
		item = list(item)
		return cls.from_dehydrated(item)

	@classmethod
	def from_dehydrated(cls, data):
		item = cls()
		for idx, key in enumerate(item.schema['format']):
			value = data[idx]

			if(hasattr(item, 'hydrate_%s' % key)):
				hydrator = getattr(item, 'hydrate_%s' % key)
				if(hasattr(hydrator, '__call__')):
					value = hydrator(value)
			item[key] = value
		return item

	@classmethod
	def get_byte_length(self):
		return struct.calcsize(self.schema['byteformat'])


class UpdateMessage(Message):
	schema = {
		'id': 2,
		'format': ['id', 'center', 'remove'],
		'byteformat': '!I??',
	}


#  TODO: more clever, general lookup-mixin?
class DirectionMessageMixin(object):
	direction_lookup = {
		rotations['north']: 1,
		rotations['south']: 2,
		rotations['east']: 3,
		rotations['west']: 4,
	}

	direction_reverse_lookup = {
		1: rotations['north'],
		2: rotations['south'],
		3: rotations['east'],
		4: rotations['west'],
	}

	def hydrate_direction(self, value):
		return self.direction_reverse_lookup.get(value, None)

	def dehydrate_direction(self, value):
		return self.direction_lookup.get(value, 0)


class FrameMessage(Message, DirectionMessageMixin):
	schema = {
		'id': 1,
		'format': ['id', 'x', 'y', 'direction', 'state'],
		'byteformat': '!IffBB'
	}


class UserActionMessage(Message, DirectionMessageMixin):
	schema = {
		'id': 3,
		'format': ['action', 'direction'],
		'byteformat': '!BB'
	}

	action_lookup = {
		'stand': 1,
		'move': 2,
		'attack': 3
	}

	action_reverse_lookup = {
		1: 'stand',
		2: 'move',
		3: 'attack'
	}

	def hydrate_action(self, value):
		return self.action_reverse_lookup.get(value, None)

	def dehydrate_action(self, value):
		return self.action_lookup.get(value, 0)


class Connection(EventsMixins):
	def __init__(self, world):
		self.world = world
		self.known = dict()
		self.last_world_index = 0
		self.last_frame_index = 0
		self.world.on('destroy_object', self.on_destroy)
		self.world.on('step', self.on_update)
		self.world.on('step', self.frame_maybe)

	def on_update(self, world):
		if(self.last_world_index != world.object_index.index):
			messages = list()
			for index in range(self.last_world_index, world.object_index.index):
				index = index+1
				world_object = world.get_object_by_id(index)
				if(hasattr(world_object, 'physics')):
					msg = UpdateMessage()
					# msg['name'] = world_object.name
					msg['id'] = world_object.id
					msg['center'] = False
					msg['remove'] = False
					messages.append(msg)
				self.last_world_index = index
			self.trigger('update', messages)

	def on_destroy(self, id):
		messages = list()
		msg = UpdateMessage()
		msg['id'] = id
		msg['center'] = False
		msg['remove'] = True
		messages.append(msg)
		self.trigger('update', messages)

	def frame_maybe(self, world):
		self.trigger('frame', self.get_frame())

	# redundant, just reset the counter on_update?
	# def get_full_update(self):
	# 	update = UpdateMessage()
	# 	for item in self.world.object_index.values():
	# 		if(hasattr(item, 'physics')):
	# 			data = dict()
	# 			data['name'] = item.name
	# 			data['id'] = item.id
	# 			data['center'] = False
	# 			update[item.id] = data
	# 	return update

	def get_frame(self, updated_only=True):
		update = list()

		for item in self.world.object_index.values():
			if(hasattr(item, 'physics')):
				data = FrameMessage()
				data['id'] = item.id
				data['x'] = item.physics.position.x
				data['y'] = item.physics.position.y
				data['direction'] = item.physics.angle
				data['state'] = 0
				if not(item in self.known.keys() and self.known[item] == data):
					update.append(data)
					self.known[item] = data
		return update

message_types = {
	1: FrameMessage,
	2: UpdateMessage,
	3: UserActionMessage
}


def pack_messages(messages):
	if(len(messages) == 0):
		return ''

	buffer_ = struct.pack('B', messages[0].schema['id'])
	for message in messages:
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
