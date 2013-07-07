from Box2D import *
from archers.world import WorldObject, ReactorMixin, SelfDestructable, NetworkMixin, directions
from archers.utils import vec2rad, rad2vec
from collisions import CLCAT_CREATURE, CLCAT_BULLET, CLCAT_EVERYTHING, CLCAT_AIRBORNE_OBSTACLE, CLCAT_TERRESTRIAL_OBSTACLE


class Archer(WorldObject, ReactorMixin, NetworkMixin):
	default_type = 'archer'
	collision_category = CLCAT_CREATURE
	collision_mask = CLCAT_EVERYTHING ^ CLCAT_AIRBORNE_OBSTACLE

	def __init__(self, world, player=None, *args, **kwargs):
		self.speed = 1.0
		self.attack_speed = 1.0
		self.arrows_speed = 1.0
		self.player = player
		self.width = 1.0
		self.height = 1.5

		# self.arrows_shot = list()
		self.state = 'unknown'
		super(Archer, self).__init__(world, type="archer", *args, **kwargs)

	def spawn(self, spawn_point):
		self.state = 'standing'
		self.create_dynamic_box_body(spawn_point.x, spawn_point.y, self.width, self.height)
		self.physics.fixedRotation = True
		self.direction = directions['east']

	def kill(self, pernament=False):
		if(not self.can_take_action()):
			return
		self.cancel_pending()
		self.want_stop()
		self.state = 'dying'
		if(not hasattr(self, 'delayed_dying') or not self.delayed_dying.active()):
			self.delayed_dying = self.reactor.callLater(
				0.9,
				self.commit_kill
			)
		# self.world.physics.DestroyBody(self.physics)
		# self.physics = None

	def is_alive(self):
		return self.can_take_action()

	def can_take_action(self):
		if(self.state == 'walking' or self.state == 'standing' or self.state == 'shooting'):
			return True
		return False

	def destroy(self):
		self.cancel_pending()
		if(hasattr(self, 'physics')):
			self.world.physics.DestroyBody(self.physics)
		super(Archer, self).destroy()

	def want_move(self, direction):
		if(not self.can_take_action()):
			return
		# import ipdb; ipdb.set_trace()
		if(not hasattr(direction, 'x')):
			direction = rad2vec(direction)
		self.cancel_pending()
		self.physics.linearVelocity = (0, 0)
		self.direction = direction

		speed_vector = direction*self.speed*6
		self.physics.ApplyLinearImpulse(
			impulse=self.physics.GetWorldVector(speed_vector),
			point=self.physics.position,
			wake=True
		)
		self.state = "walking"

	def want_stop(self):
		if(not self.can_take_action()):
			return
		self.cancel_pending()
		self.physics.linearVelocity = (0, 0)
		self.state = "standing"

	def want_attack(self, direction):
		if(not self.can_take_action()):
			return
		if(not hasattr(direction, 'x')):
			direction = rad2vec(direction)

		self.want_stop()
		self.direction = direction
		if(not hasattr(self, 'delayed_attack') or not self.delayed_attack.active()):
			self.delayed_attack = self.reactor.callLater(
				0.75*self.attack_speed,
				self.commit_attack,
				direction
			)
			self.state = "shooting"

	def commit_attack(self, direction):
		Arrow(direction, self.arrows_speed, self, reactor=self.reactor)
		self.want_stop()
		# self.arrows_shot.append(arrow)

	def commit_kill(self):
		self.state = "dead"

	def cancel_pending(self):
		if(hasattr(self, 'delayed_attack') and self.delayed_attack.active()):
			self.delayed_attack.cancel()
		if(hasattr(self, 'delayed_dying') and self.delayed_dying.active()):
			self.delayed_dying.cancel()


class Arrow(SelfDestructable, NetworkMixin):
	collision_category = CLCAT_BULLET
	# collision_mask = CLCAT_OBSTACLE | CLCAT_AIRBORNE_OBSTACLE | CLCAT_CREATURE 
	# collision_mask = CLCAT_OBSTACLE | CLCAT_AIRBORNE_OBSTACLE | CLCAT_CREATURE
	# collision_mask = CLCAT_EVERYTHING ^ CLCAT_TERRESTRIAL_OBSTACLE
	collision_mask = CLCAT_EVERYTHING ^ CLCAT_TERRESTRIAL_OBSTACLE

	def __init__(self, direction, speed, owner, **kwargs):
		self.owner = owner
		self.speed = 1.0          
		self.width = 0.5
		self.height = 0.15
		self.state = 'shooting'
		super(Arrow, self).__init__(
			owner.world,
			type="arrow",
			lifetime=1.0,
			**kwargs)

		target_position = b2Vec2(
			direction.x*(owner.width-self.width),
			direction.y*(owner.height-self.height)
		)
		target_position = owner.physics.position + target_position

		self.create_dynamic_box_body(
			target_position.x,
			target_position.y,
			self.width, self.height, friction=0.9
		)

		self.physics.fixedRotation = True
		self.direction = direction
		self.physics.angle = vec2rad(direction)

		speed_vector = b2Vec2(1,0)*self.speed*1.5
		self.physics.ApplyLinearImpulse(
			impulse=self.physics.GetWorldVector(speed_vector),
			point=self.physics.position,
			wake=True
		)
		self.physics.bullet = True
		# import ipdb; ipdb.set_trace()

	def attach_collision_data(self, fixture):
		super(Arrow, self).attach_collision_data(fixture)
		fixture.filterData.groupIndex = self.owner.id*-1

	def destroy(self, source="dupa"):
		# self.owner.arrows_shot.remove(self)
		self.world.physics.DestroyBody(self.physics)
		super(Arrow, self).destroy()
