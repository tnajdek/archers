from archers.utils import EventsMixins


class Message(dict):
	def __init__(self, *args, **kwargs):
		if(args):
			self.hydrate(args[0])

	def hydrate(self, data):
		self.clear()
		for data_item in data:
			item = dict()
			for key in self.schema:
				item[key] = data_item.pop(0)
			self.__setitem__(item[self.schema_key], item)

	def dehydrate(self):
		dehydrated = list()
		for item_id, item in self.iteritems():
			dehydrated_item = list()
			for key in self.schema:
				dehydrated_item.append(self.get(key, 0))
			dehydrated.append(dehydrated_item)
		return dehydrated

	def append(self, item):
		return self.__setitem__(item[self.schema_key], item)


class UpdateMessage(Message):
	schema_key = 'id'
	schema_item = ['id', 'name', 'center']


class FrameMessage(Message):
	schema_key = 'id'
	schema_item = ['x', 'y', 'direction', 'state']


class Connection(EventsMixins):
	def __init__(self, world):
		self.world = world
		self.known = dict()
		self.last_world_index = 0
		self.world.on('step', self.on_update)

	def on_update(self, world):
		if(self.last_world_index != world.object_index.index):
			items = UpdateMessage()
			for index in range(self.last_world_index, world.object_index.index):
				index = index+1
				world_object = world.get_object_by_id(index)
				if(hasattr(world_object, 'physics')):
					item = dict()
					item['name'] = world_object.name
					item['id'] = world_object.id
					item['center'] = False
					items.append(item)
				self.last_world_index = index
			self.trigger('update', items)

	def get_full_update(self):
		update = UpdateMessage()
		for item in self.world.object_index.values():
			if(hasattr(item, 'physics')):
				data = dict()
				data['name'] = item.name
				data['id'] = item.id
				data['center'] = False
				update[item.id] = data
		return update

	def get_frame(self, updated_only=True):
		update = FrameMessage()

		for item in self.world.object_index.values():
			if(hasattr(item, 'physics')):
				data = dict()
				data['x'] = item.physics.position.x
				data['y'] = item.physics.position.y
				data['direction'] = item.physics.angle
				data['state'] = 'todo'
				if not(item in self.known.keys() and self.known[item] == data):
					update[item.id] = data
					self.known[item] = data
		return update
