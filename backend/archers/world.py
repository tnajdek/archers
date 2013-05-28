import tmxlib
from Box2D import *
import settings

directions = {
	'north': b2Vec2(0, -1),
	'south': b2Vec2(0, 1),
	'east': b2Vec2(1, 0),
	'west': b2Vec2(-1, 0),
}

class ListWithCounter(list):
	def __init__(self):
		self.counter = 0
	def append(self, item):
		self.counter = self.counter + 1
		return super(ListWithCounter, self).append(item)


class WorldObject(object):
	type_lookup = dict()
	name_lookup = dict()

	@classmethod
	find_by_type(class_, type_):
		return class_.type_lookup[type_]

	@classmethod
	find_by_name(class_, name):
		return class_.name_lookup[name]

	def __init__(self, type=None, name=None):
		class_ = self.__class__
		self.type = type
		if(not self.type):
			self.type = 'Unknown'
		if(not self.type in self.__class__.type_lookup.keys()):
			class_.type_lookup[self.type] = ListWithCounter()
		objects_of_this_type = class_.type_lookup[self.type]
		self.name = name
		if(not self.name):
			self.name = "%s_%s" % (self.type, objects_of_this_type.counter)
		objects_of_this_type.append(self)
		if(self.name in class_.name_lookup.keys()):
			raise Exception("Duplicate WorldObject with name %s found" % self.name)
		class_.name_lookup[self.name] = self


class Collidable(WorldObject):
	def __init__(self, world, data, **kwargs):
		self.physics = world.physics.CreateStaticBody(
				position=(data.x, data.y),
				shapes=b2PolygonShape(box=data.size),
		)
		type_ = data.type
		if 'type' in kwargs:
			type_ = kwargs['type']
		name = data.name
		if 'name' in kwargs:
			name = kwargs['name']

		super(Collidable, self).__init__(type=type_, name=name)


class World(object):
	def __init__(self, map_filename):
		self.map = tmxlib.Map.open(map_filename)
		self.layers = dict()
		for layer in self.map.layers:
			self.layers[layer.name] = layer
		self.physics = b2World(gravity=(0, 0))
		self.build_collidable_bodies(self.layers['collision'])

	def build_collidable_bodies(self, layer):
		for collidable in layer.all_objects():
			Collidable(self, collidable)

	def get_spawn_points(self):
		return self.layers['spawn'].all_objects()

	def get_collidables(self, type, name):
		return self.layers['collision'].all_objects()

	def step(self):
		self.physics.Step(settings.TIME_STEP, 10, 10)
