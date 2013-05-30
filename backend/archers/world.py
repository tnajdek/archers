import tmxlib
from Box2D import *
import settings
from twisted.internet import reactor
from archers.utils import vec2rad

directions = {
	'north': b2Vec2(0, -1),
	'south': b2Vec2(0, 1),
	'east': b2Vec2(1, 0),
	'west': b2Vec2(-1, 0),
}

rotations = {
	'north': vec2rad(directions['north']),
	'south': vec2rad(directions['south']),
	'east': vec2rad(directions['east']),
	'west': vec2rad(directions['west']),
}


class ListWithCounter(list):
	def __init__(self):
		self.counter = 0

	def append(self, item):
		self.counter = self.counter + 1
		return super(ListWithCounter, self).append(item)


class Base(object):
	def __init__(*args, **kwargs):
		pass


class ReactorMixin(Base):
	def __init__(self, *args, **kwargs):
		self.reactor = kwargs.pop('reactor', reactor)
		super(ReactorMixin, self).__init__(*args, **kwargs)


class WorldObject(Base):
	default_type = 'unknown'

	def __init__(self, world, type=None, name=None, *args, **kwargs):
		self.world = world
		self.type = type
		self.name = name

		if(not self.type):
			self.type = self.__class__.default_type
		if(not self.type in world.object_lookup_by_type.keys()):
			world.object_lookup_by_type[self.type] = ListWithCounter()
		objects_of_this_type = world.object_lookup_by_type[self.type]

		if(not self.name):
			self.name = "%s_%s" % (self.type, objects_of_this_type.counter)
		objects_of_this_type.append(self)
		if(self.name in world.object_lookup_by_name.keys()):
			raise Exception("Duplicate WorldObject with name %s found" % self.name)
		world.object_lookup_by_name[self.name] = self
		super(WorldObject, self).__init__(*args, **kwargs)

	def destroy(self):
		self.world.object_lookup_by_name.pop(self.name)
		self.world.object_lookup_by_type[self.type].remove(self)


class MapObject(WorldObject):
	def __init__(self, world, data, **kwargs):
		type_ = data.type
		if 'type' in kwargs:
			type_ = kwargs['type']
		name = data.name
		if 'name' in kwargs:
			name = kwargs['name']
		super(MapObject, self).__init__(world, type=type_, name=name)


class Collidable(MapObject):
	default_type = 'collidable'

	def __init__(self, world, data, **kwargs):
		self.physics = world.physics.CreateStaticBody(
				position=(data.x, data.y),
				shapes=b2PolygonShape(box=data.size),
		)
		super(Collidable, self).__init__(world, data, **kwargs)


class SpawnPoint(MapObject):
	default_type = 'spawn'

	def __init__(self, world, data, **kwargs):
		self.x = data.x
		self.y = data.y
		super(SpawnPoint, self).__init__(world, data, **kwargs)


class SelfDestructable(WorldObject, ReactorMixin):
	def __init__(self, *args, **kwargs):
		lifetime = kwargs.pop('lifetime', 1.0)
		super(SelfDestructable, self).__init__(*args, **kwargs)
		self.self_destruction_task = self.reactor.callLater(lifetime, self.destroy)

	def destroy(self):
		super(SelfDestructable, self).destroy()


class World(object):
	def __init__(self, map_filename):
		self.map = tmxlib.Map.open(map_filename)
		self.layers = dict()
		self.object_lookup_by_type = dict()
		self.object_lookup_by_name = dict()
		for layer in self.map.layers:
			self.layers[layer.name] = layer
		self.physics = b2World(gravity=(0, 0))
		self.init_collidable_bodies(self.layers['collision'])
		self.init_spawn_points(self.layers['spawn'])

	def init_collidable_bodies(self, layer):
		for collidable in layer.all_objects():
			Collidable(self, collidable)

	def init_spawn_points(self, layer):
		for sp in layer.all_objects():
				SpawnPoint(self, sp)

	def get_spawn_points(self):
		return self.object_lookup_by_type['spawn']

	def get_collidables(self, type, name):
		return self.layers['collision'].all_objects()

	def get_objects_by_type(self, type_):
		return self.object_lookup_by_type[type_]

	def get_object_by_name(self, name):
		return self.object_lookup_by_name[name]

	def step(self):
		self.physics.Step(settings.TIME_STEP, 10, 10)
