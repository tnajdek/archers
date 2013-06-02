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


class UniqueIndex(dict):
	def __init__(self):
		self.counter = 0

	def index(self, item):
		self.counter = self.counter + 1
		super(UniqueIndex, self).__setitem__(item, self.counter)
		return self.counter


class Base(object):
	def __init__(*args, **kwargs):
		pass

	def get_class_name(self):
		return self.__class__.__name__


class ReactorMixin(Base):
	def __init__(self, *args, **kwargs):
		self.reactor = kwargs.pop('reactor', reactor)
		super(ReactorMixin, self).__init__(*args, **kwargs)


class WorldObject(Base):
	default_type = 'unknown'

	def create_static_box_body(self, x, y, w, h):
		self.width = w
		self.height = h

		self.physics = self.world.physics.CreateStaticBody(
				position=(x, y),
				shapes=b2PolygonShape(box=(w*0.5, h*0.5)),
		)

		self.physics.fixtures[0].userData = self

	def create_dynamic_box_body(self, x, y, w, h, **kwargs):
		self.width = w
		self.height = h

		self.physics = self.world.physics.CreateDynamicBody(
			position=(x, y)
		)
		kwargs['box'] = kwargs.get('box', (0.5*w, 0.5*h))
		kwargs['density'] = kwargs.get('density', 1)
		kwargs['friction'] = kwargs.get('friction', 0.3)
		kwargs['userData'] = self

		self.physics.CreatePolygonFixture(**kwargs)

	def __init__(self, world, type=None, name=None, *args, **kwargs):
		self.world = world
		self.world.add_object(self)
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
		super(Collidable, self).__init__(world, data, **kwargs)
		self.create_static_box_body(data.x, data.y, data.size[0], data.size[1])


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
		if(hasattr(self, 'self_destruction_task') and self.self_destruction_task.active()):
			self.self_destruction_task.cancel()
		super(SelfDestructable, self).destroy()


#  very lame for the time being
class Collisions(b2ContactListener):
	def __init__(self, world):
		b2ContactListener.__init__(self)
		self.world = world

	# def BeginContact(self, contact):
	# 	pass

	# def EndContact(self, contact):
	# 	pass

	def PreSolve(self, contact, old_manifold):
		if(contact.fixtureA.userData.get_class_name() != 'Arrow'
			and contact.fixtureB.userData.get_class_name() != 'Arrow'):
			return

		if(contact.fixtureA.userData.get_class_name() != 'Player'
			and contact.fixtureB.userData.get_class_name() != 'Player'):
			return

		#  TODO: need better kill/destroy logic
		self.world.kill(contact.fixtureA.userData)
		self.world.kill(contact.fixtureB.userData)

	# def PostSolve(self, contact, impulse):
	# 	pass


class World(object):
	def __init__(self, map_filename):
		self.map = tmxlib.Map.open(map_filename)
		self.layers = dict()
		self.object_lookup_by_type = dict()
		self.object_lookup_by_name = dict()
		self.objects_to_be_destroyed = list()
		self.object_index = UniqueIndex()
		for layer in self.map.layers:
			self.layers[layer.name] = layer
		self.physics = b2World(
			gravity=(0, 0),
			contactListener=Collisions(self)
		)
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

	def get_object_id(self, object_):
		return self.object_index.get(object_, None)

	def add_object(self, world_object):
		id = self.object_index.index(world_object)
		world_object.id = id

	def kill(self, killme):
		if not killme in self.objects_to_be_destroyed:
			self.objects_to_be_destroyed.append(killme)

	def build_frame(self):
		pass

	def step(self):
		while self.objects_to_be_destroyed:
			killme = self.objects_to_be_destroyed.pop()
			if(hasattr(killme, 'kill') and callable(getattr(killme, 'kill'))):
				killme.kill()
			else:
				killme.destroy(source="step")
			del self.object_index[killme]

		self.physics.Step(settings.TIME_STEP, 10, 10)
