

class Message(dict):
	def __init__(self, **kwargs):
		pass

	def hydrate(self, data):
		items = dict()
		for data_item in data:
			item = dict()
			for key in self.schema:
				item[key] = data_item.pop(0)
			items[item[self.schema_key]] = item
		self.items = items


class FullUpdateMessage(Message):
	schema_key = 'id'
	schema_item = ['id', 'name', 'center']
	def __init__(self):
		self.items = dict()

	def dehydrate(self):
		simplified = list()
		for item_id, item in self.items.iteritems():
			simplified_item = list()
			simplified_item.append(item['id'])
			simplified_item.append(item['name'])
			simplified_item.append(item['center'])
		simplified.append(simplified_item)

	def hydrate(self, data):
		items = dict()
		for data_item in data:
			item = dict()
			(item['id'], item['name'], item['center']) = data_item
			items[item['id']] = item
		self.items = items


class FrameMessage(Message):
	def __init__(self):
		self.items = dict()


class Connection(object):
	def __init__(self, world):
		self.world = world
		self.known = dict()

	def get_full_update(self):
		update = FullUpdateMessage()
		for item in self.world.object_index.keys():
			if(hasattr(item, 'physics')):
				data = dict()
				data['name'] = item.name
				data['id'] = item.id
				data['center'] = False
				update.items[item.id] = data
		return update

	def get_frame(self, updated_only=True):
		update = FrameMessage()

		for item in self.world.object_index.keys():
			if(hasattr(item, 'physics')):
				data = dict()
				data['x'] = item.physics.position.x
				data['y'] = item.physics.position.y
				data['direction'] = item.physics.angle
				data['state'] = 'todo'
				if not(item in self.known.keys() and self.known[item] == data):
					update.items[item.id] = data
					self.known[item] = data
		return update
