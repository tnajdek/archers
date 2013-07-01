from Box2D import *
from archers.world import WorldObject, ReactorMixin, SelfDestructable, rotations
from archers.utils import vec2rad

class Player(WorldObject, ReactorMixin):
	default_type = 'player'

	def __init__(self, world, *args, **kwargs):
		self.speed = 1.0
		self.attack_speed = 1.0
		self.arrows_speed = 1.0
		# self.arrows_shot = list()
		self.dead = True
		super(Player, self).__init__(world, type="player", *args, **kwargs)

	def spawn(self, spawn_point):
		self.dead = False
		self.create_dynamic_box_body(spawn_point.x, spawn_point.y, 2, 2)
		self.physics.fixedRotation = True
		self.physics.angle = rotations['east']

	def kill(self):
		self.cancel_pending()
		self.dead = True
		# self.world.physics.DestroyBody(self.physics)
		# self.physics = None

	def destroy(self):
		self.cancel_pending()
		self.world.physics.DestroyBody(self.physics)
		super(Player, self).destroy()

	def want_move(self, direction):
		self.cancel_pending()
		self.physics.linearVelocity = (0, 0)
		self.physics.angle = vec2rad(direction)
		speed_vector = b2Vec2(1, 0)*self.speed*10
		self.physics.ApplyLinearImpulse(
			impulse=self.physics.GetWorldVector(speed_vector),
			point=self.physics.position,
			wake=True
		)

	def want_stop(self):
		self.cancel_pending()
		self.physics.linearVelocity = (0, 0)

	def want_attack(self, direction):
		self.physics.angle = vec2rad(direction)
		if(not hasattr(self, 'delayed_attack') or not self.delayed_attack.active()):
			self.delayed_attack = self.reactor.callLater(
				0.5*self.attack_speed,
				self.commit_attack,
				direction
			)

	def commit_attack(self, direction):
		arrow = Arrow(direction, self.arrows_speed, self, reactor=self.reactor)
		# self.arrows_shot.append(arrow)

	def cancel_pending(self):
		if(hasattr(self, 'delayed_attack') and self.delayed_attack.active()):
			self.delayed_attack.cancel()


class Arrow(SelfDestructable):
	def __init__(self, direction, speed, owner, **kwargs):
		self.owner = owner
		self.speed = 0.5
		self.width = 0.1
		self.height = 0.1
		super(Arrow, self).__init__(
			owner.world,
			type="arrow",
			lifetime=5.0,
			**kwargs)

		target_position = b2Vec2(
			direction.x*(owner.width+self.width),
			direction.y*(owner.height+self.height)
		)
		target_position = owner.physics.position + target_position

		self.create_dynamic_box_body(
			target_position.x,
			target_position.y,
			0.2, 0.2, friction=0.9
		)
		self.physics.fixedRotation = True
		self.physics.angle = vec2rad(direction)
		speed_vector = b2Vec2(1, 0)*self.speed
		self.physics.ApplyLinearImpulse(
			impulse=self.physics.GetWorldVector(speed_vector),
			point=self.physics.position,
			wake=True
		)

	def destroy(self, source="dupa"):
		# self.owner.arrows_shot.remove(self)
		self.world.physics.DestroyBody(self.physics)
		super(Arrow, self).destroy()
