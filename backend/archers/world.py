import tmxlib
from Box2D import *
from bidict import bidict
import random
import settings
from twisted.internet import reactor
from archers.utils import vec2rad, EventsMixins
from archers.utils import p2m, m2p, limit, get_class
from collisions import Collisions, CLCAT_OBSTACLE, CLCAT_TERRESTRIAL_OBSTACLE, CLCAT_BULLET, CLCAT_EVERYTHING

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

from archers.messages import UpdateMessage, FrameMessage, RemoveMessage, EventMessage


class ListWithCounter(list):
	def __init__(self):
		self.counter = 0

	def append(self, item):
		self.counter = self.counter + 1
		return super(ListWithCounter, self).append(item)


# class UniqueIndex(dict):
# 	def __init__(self):
# 		self.index = 0
# 		self.reverse = dict()

# 	def __delitem__(self, id_):
# 		item = None
# 		if(isinstance(id_, (int, long))):
# 			item = self.get(id_)
# 		elif(id_ in self.reverse.keys()):
# 			item = id_
# 			id_ = self.get_by_value(item)
# 		if(item):
# 			super(UniqueIndex, self).__delitem__(id_)
# 			del self.reverse[item]

# 	def append(self, item):
# 		self.index = self.index + 1
# 		super(UniqueIndex, self).__setitem__(self.index, item)
# 		self.reverse[item] = self.index
# 		return self.index

# 	def get_by_value(self, *args):
# 		return self.reverse.get(*args)


class Base(object):
	def __init__(*args, **kwargs):
		pass

	def get_class_name(self):
		return self.__class__.__name__


class ReactorMixin(Base):
	def __init__(self, world, *args, **kwargs):
		self.reactor = kwargs.pop('reactor', reactor)
		super(ReactorMixin, self).__init__(world, *args, **kwargs)

class ProcessableMixin(Base):
	def __init__(self, world, *args, **kwargs):
		world.processables.append(self)
		super(ProcessableMixin, self).__init__(world, *args, **kwargs)

	def destroy(self):
		self.world.processables.remove(self)
		super(ProcessableMixin, self).destroy()

	def process(self):
		pass


class NetworkMixin(Base):
	def get_update_message(self, recipient=None):
		msg = UpdateMessage()
		msg['id'] = self.id
		msg['entity_type'] = self.__class__.__name__
		msg['width'] = limit(m2p(self.get_dimensions()['width']))
		msg['height'] = limit(m2p(self.get_dimensions()['height']))
		msg['x'] = limit(m2p(self.get_position()['x']))
		msg['y'] = limit(m2p(self.get_position()['y']))
		msg['direction'] = self.get_direction()
		msg['state'] = getattr(self, 'state', 'unknown')
		msg['player'] = (recipient and hasattr(recipient, 'session_id') and hasattr(self, 'player') and hasattr(self.player, 'session_id') and recipient.session_id == self.player.session_id)
		return msg

	def get_frame_message(self):
		msg = FrameMessage()
		msg['id'] = self.id
		msg['x'] = limit(m2p(self.get_position()['x']))
		msg['y'] = limit(m2p(self.get_position()['y']))
		msg['direction'] = self.get_direction()
		msg['state'] = getattr(self, 'state', 'unknown')
		return msg

	def get_destroy_message(self):
		msg = RemoveMessage()
		msg['id'] = self.id
		return msg


class WorldObject(Base):
	default_type = 'unknown'
	# collision_category = CLCAT_OBSTACLE
	# collision_mask = CLCAT_EVERYTHING

	def attach_collision_data(self, fixture):
		fixture.filterData.categoryBits = self.collision_category
		fixture.filterData.maskBits = self.collision_mask
		fixture.filterData.groupIndex = 1

	def update_collision_definition(self):
		self.attach_collision_data(self.physics.fixtures[0])

	def create_static_polygon_body(self, x, y, vertices):
		self.physics = self.world.physics.CreateStaticBody(
				position=(x, y),
				shapes=b2PolygonShape(
					vertices=vertices,
					# categoryBits=type(self).collision_category,
					# maskBits=type(self).collision_mask,
					# groupIndex=self.id*-1
				)
		)
		self.physics.fixtures[0].userData = self
		self.attach_collision_data(self.physics.fixtures[0])

	def create_static_box_body(self, x, y, w, h):
		self.width = w
		self.height = h

		# import ipdb; ipdb.set_trace()

		self.physics = self.world.physics.CreateStaticBody(
				position=(x+0.5*w, y+0.5*h),
				shapes=b2PolygonShape(
					box=(w*0.5, h*0.5),
					# categoryBits=type(self).collision_category,
					# maskBits=type(self).collision_mask,
					# groupIndex=self.id*-1
				),
		)

		self.physics.fixtures[0].userData = self
		self.attach_collision_data(self.physics.fixtures[0])

	def create_dynamic_box_body(self, x, y, w, h, **kwargs):
		self.width = w
		self.height = h

		self.physics = self.world.physics.CreateDynamicBody(
			position=(x, y)
		)
		kwargs['box'] = kwargs.get('box', (0.5*w, 0.5*h))
		kwargs['density'] = kwargs.get('density', 1)
		kwargs['friction'] = kwargs.get('friction', 0.3)
		# kwargs['density'] = kwargs.get('mass', 1)
		# kwargs['categoryBits'] = type(self).collision_category
		# kwargs['maskBits'] = type(self).collision_mask
		# kwargs['groupIndex'] = 1

		self.physics.CreatePolygonFixture(**kwargs)

		self.physics.fixtures[0].userData = self
		self.attach_collision_data(self.physics.fixtures[0])

	def __init__(self, world, type=None, name=None, *args, **kwargs):
		self.world = world
		self.world.add_object(self)
		self.type = type
		self.name = name

		# copy collision cat/mask from class to instance
		# self.collision_category = type(self).collision_category
		# self.collision_mask = type(self).collision_mask
		# print(self.collision_category)


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
		super(WorldObject, self).__init__(world, *args, **kwargs)

	def destroy(self):
		self.world.trigger('destroy_object', self)
		# id = self.world.object_index[:self]
		self.world.object_lookup_by_name.pop(self.name)
		self.world.object_lookup_by_type[self.type].remove(self)
		del self.world.object_index[:self]
		if(hasattr(self, 'world')):
			self.world = None

	def get_dimensions(self):
		dimensions = dict()
		if(hasattr(self, 'width')):
			dimensions['width'] = self.width
		else:
			dimensions['width'] = 0

		if(hasattr(self, 'height')):
			dimensions['height'] = self.height
		else:
			dimensions['height'] = 0

		return dimensions

	def get_position(self):
		position = dict()
		if(hasattr(self, 'physics') and hasattr(self, 'width') and hasattr(self, 'height')):
			position['x'] = self.physics.position.x
			position['y'] = self.physics.position.y
		else:
			position['x'] = 0
			position['y'] = 0
		return position

	def get_direction(self):
		if(hasattr(self, 'direction')):
			return self.direction
		return directions['south']


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
	collision_category = CLCAT_OBSTACLE
	collision_mask = CLCAT_EVERYTHING

	def __init__(self, world, data, **kwargs):
		super(Collidable, self).__init__(world, data, **kwargs)
		if(data.__class__.__name__ == "RectangleObject"):
			self.create_static_box_body(data.x, data.y, data.size[0], data.size[1])
		elif(data.__class__.__name__ == "PolygonObject"):
			vertices = [p2m(x) for x in data.points]
			self.create_static_polygon_body(data.pos[0], data.pos[1], vertices)
		else:
			raise Exception("Object type %s is not supported" % data.__class__.__name__)

	def destroy(self):
		self.world.physics.DestroyBody(self.physics)
		super(Collidable, self).destroy()


class GroundCollidable(Collidable):
	default_type = 'groundcollidable'
	collision_category = CLCAT_TERRESTRIAL_OBSTACLE
	#collision_mask =  ~(CLCAT_OBSTACLE | CLCAT_TERRESTRIAL_OBSTACLE | CLCAT_BULLET)
	collision_mask = CLCAT_EVERYTHING & ~CLCAT_BULLET
	# collision_mask = CLCAT_EVERYTHING ^ CLCAT_BULLET


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
		self.self_destruction_task = self.reactor.callLater(lifetime, self.self_destruct)

	def cancel_pending(self):
		if(hasattr(self, 'self_destruction_task') and self.self_destruction_task.active()):
			self.self_destruction_task.cancel()

	def self_destruct(self):
		self.cancel_pending()
		self.world.kill(self)

	def destroy(self):
		self.cancel_pending()
		super(SelfDestructable, self).destroy()


class World(EventsMixins):
	def __init__(self, map_filename):
		super(World, self).__init__()
		self.step = 0
		self.map = tmxlib.Map.open(map_filename)
		self.layers = dict()
		self.object_lookup_by_type = dict()
		self.object_lookup_by_name = dict()
		self.objects_to_be_destroyed = list()
		self.object_index = bidict()
		self.object_index.index = 0
		self.group_index = []
		self.pickups_lookup = dict()
		self.processables = []

		for layer in self.map.layers:
			self.layers[layer.name] = layer
		self.physics = b2World(
			gravity=(0, 0),
			contactListener=Collisions(self)
		)
		self.init_collidable_bodies(self.layers['collision'], Collidable)
		self.init_collidable_bodies(self.layers['groundcollision'], GroundCollidable)
		self.init_pickups(self.layers['pickups'])
		self.init_spawn_points(self.layers['spawn'])

	def init_collidable_bodies(self, layer, klass):
		for collidable in layer.all_objects():
			klass(self, collidable)

	def init_spawn_points(self, layer):
		for sp in layer.all_objects():
				SpawnPoint(self, sp)

	def init_pickups(self, layer):
		# from archers.pickups import BronzeCoin, SilverCoin, GoldCoin
		for pickup in layer.all_objects():
			if(not 'respawn_time' in pickup.properties):
				pickup.properties['respawn_time'] = random.randint(30, 120)
			
			# try:
			classname = get_class('.'.join(['archers', 'pickups', pickup.type]))
			obj = classname(self, pickup)
			self.pickups_lookup[pickup] = {
				'pickup_id': self.get_object_id(obj),
				'step_placed': self.step,
				'step_destroyed': None
			}
			# except NameError:
			# 	pass

	def recreate_pickups(self, layer):
		for pickup in layer.all_objects():
			in_lookup = self.pickups_lookup[pickup]
			if(in_lookup):
				try:
					existing_pickup = self.get_object_by_id(in_lookup['pickup_id'])
				except KeyError:
					gone_seconds_ago = (self.step - in_lookup['step_destroyed'])/60.0
					if(gone_seconds_ago >= int(pickup.properties['respawn_time'])):
						
						#@TODO:Duplicate code above!
						classname = get_class('.'.join(['archers', 'pickups', pickup.type]))
						obj = classname(self, pickup)
						self.pickups_lookup[pickup] = {
							'pickup_id': self.get_object_id(obj),
							'step_placed': self.step,
							'step_destroyed': None
						}


	def get_spawn_points(self):
		return self.object_lookup_by_type['spawn']

	def get_collidables(self, type, name):
		return self.layers['collision'].all_objects()

	def get_objects_by_type(self, type_):
		return self.object_lookup_by_type[type_]

	def get_object_by_name(self, name):
		return self.object_lookup_by_name[name]

	def get_object_by_id(self, id):
		obj = self.object_index[id:]
		# try:

		# except KeyError:
		# 	obj = None
		return obj

	def get_object_id(self, object_):
		obj = self.object_index[:object_]
		# try:

		# except KeyError:
		# 	obj = None
		return obj

	def add_object(self, world_object):
		self.trigger('add_object', self)
		self.object_index.index = self.object_index.index + 1
		self.object_index[self.object_index.index] = world_object
		world_object.id = self.object_index.index

	def kill(self, killme):
		if not killme in self.objects_to_be_destroyed:
			self.objects_to_be_destroyed.append(killme)

	def trigger_event(self, event_type, x, y):
		msg = EventMessage()
		msg['type'] = event_type
		msg['x'] = limit(m2p(x))
		msg['y'] = limit(m2p(y))
		self.networking_factory.broadcast_messages([msg,])

	def get_free_group_index(self):
		for i in range(10, 32768):
			if not i in self.group_index:
				self.group_index.append(i)
				return i
		# pooo

	def release_group_index(self, i):
		if i in self.group_index:
			self.group_index.remove(i)


	def networking_step(self):
		self.trigger('step', self)

	def processing_step(self):

		while self.objects_to_be_destroyed:
			killme = self.objects_to_be_destroyed.pop()
			if(hasattr(killme, 'kill') and callable(getattr(killme, 'kill'))):
				killme.kill()
			else:
				killme.destroy()

		if(self.step % (1.0/settings.PROCESSING_STEP) == 0.0):
			self.recreate_pickups(self.layers['pickups'])

		for obj in self.processables:
			obj.process()

		self.physics.Step(settings.PROCESSING_STEP, settings.PHYSICS_VEL_ITERS, settings.PHYSICS_POS_ITERS)
		self.step = self.step+1
