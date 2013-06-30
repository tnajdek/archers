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


class EntityMessageMixin(object):
	entity_type_lookup = {
		'Unknown': 0,
		'Collidable': 1,
		'Player': 2,
		'Arrow': 3,
	}

	entity_type_reverse_lookup = {
		0: 'Unknown',
		1: 'Collidable',
		2: 'Player',
		3: 'Arrow',
	}

	def hydrate_entity_type(self, value):
		return self.entity_type_reverse_lookup.get(value, None)

	def dehydrate_entity_type(self, value):
		return self.entity_type_lookup.get(value, 0)


class FrameMessage(Message, DirectionMessageMixin):
	schema = {
		'id': 1,
		'format': ['id', 'x', 'y', 'direction', 'state'],
		'byteformat': '!IIIBB'
	}


class UpdateMessage(Message, EntityMessageMixin, DirectionMessageMixin):
	schema = {
		'id': 2,
		'format': ['id', 'entity_type', 'width', 'height', 'x', 'y', 'direction', 'state'],
		'byteformat': '!IBIIIIBB',
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


class RemoveMessage(Message):
	schema = {
		'id': 4,
		'format': ['id'],
		'byteformat': '!I'
	}

message_types = {
	1: FrameMessage,
	2: UpdateMessage,
	3: UserActionMessage,
	4: RemoveMessage
}