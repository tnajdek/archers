from archers.world import directions
import struct
from bidict import bidict

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


class DirectionMessageMixin(object):
	direction_lookup = bidict({
		directions['north']: 1,
		directions['south']: 2,
		directions['east']: 3,
		directions['west']: 4
	})

	def hydrate_direction(self, value):
		return self.direction_lookup.inv.get(value, directions['south'])

	def dehydrate_direction(self, value):
		# value = int(value)
		return self.direction_lookup.get(value, 2)


class StateMessageMixin(object):
	state_lookup = bidict({
		'standing': 1,
		'walking': 2,
		'shooting': 3,
		'dying': 4,
		'dead': 5
	})

	def hydrate_state(self, value):
		return self.state_lookup.inv.get(value, None)

	def dehydrate_state(self, value):
		return self.state_lookup.get(value, 0)


class EntityMessageMixin(object):
	entity_type_lookup = bidict({
		'Unknown': 0,
		'Collidable': 1,
		'Archer': 2,
		'Arrow': 3,
		'Skeleton': 4,
		'CopperCoin': 5,
		'SilverCoin': 6,
		'GoldCoin': 7,
	})

	def hydrate_entity_type(self, value):
		return self.entity_type_lookup.inv.get(value, None)

	def dehydrate_entity_type(self, value):
		return self.entity_type_lookup.get(value, 0)


class FrameMessage(Message, DirectionMessageMixin, StateMessageMixin):
	schema = {
		'id': 1,
		'format': ['id', 'x', 'y', 'direction', 'state'],
		'byteformat': '!IIIBB'
	}


class UpdateMessage(Message, EntityMessageMixin, DirectionMessageMixin, StateMessageMixin):
	schema = {
		'id': 2,
		'format': ['id', 'entity_type', 'width', 'height', 'x', 'y', 'direction', 'state', 'player'],
		'byteformat': '!IBIIIIBB?',
	}

class UserActionMessage(Message, DirectionMessageMixin):
	schema = {
		'id': 3,
		'format': ['action', 'direction'],
		'byteformat': '!BB'
	}

	action_lookup = bidict({
		'init': 0,
		'spawn': 1,
		'stop': 2,
		'move': 3,
		'attack': 4
	})

	def hydrate_action(self, value):
		return self.action_lookup.inv.get(value, None)

	def dehydrate_action(self, value):
		return self.action_lookup.get(value, 0)


class RemoveMessage(Message):
	schema = {
		'id': 4,
		'format': ['id'],
		'byteformat': '!I'
	}


class EventMessage(Message):
	schema = {
		'id': 5,
		'format': ['type', 'x', 'y'],
		'byteformat': '!III'
	}

	event_type_lookup = bidict({
		'unknown': 0,
		'deflect': 1
	})

	def hydrate_type(self, value):
		return self.event_type_lookup.inv.get(value, None)

	def dehydrate_type(self, value):
		return self.event_type_lookup.get(value, 0)


message_types = {
	1: FrameMessage,
	2: UpdateMessage,
	3: UserActionMessage,
	4: RemoveMessage,
	5: EventMessage
}


