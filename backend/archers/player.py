from Box2D import *
from archers.world import WorldObject, ReactorMixin, SelfDestructable


class Player(WorldObject, ReactorMixin):
	default_type = 'player'

	def __init__(self, world, *args, **kwargs):
		self.speed = 1.0
		self.attack_speed = 1.0
		self.arrows_speed = 1.0

		self.arrows_shot = list()
		super(Player, self).__init__(world, type="player", *args, **kwargs)

	def spawn(self, spawn_point):
		self.physics = self.world.physics.CreateDynamicBody(
			position=(spawn_point.x, spawn_point.y)
		)
		self.physics.fixedRotation = True
		self.physics.CreatePolygonFixture(box=(1, 1), density=1, friction=0.3)

	def destroy(self):
		self.cancel_pending()
		self.world.physics.DestroyBody(self.physics)
		super(Player, self).destroy()

	def want_move(self, direction):
		self.cancel_pending()
		self.physics.linearVelocity = (0,0)
		speed_vector = direction*self.speed*50
		self.physics.ApplyLinearImpulse(
			impulse=self.physics.GetWorldVector(speed_vector),
			point=self.physics.position,
			wake=True
		)

	def want_stop(self):
		self.cancel_pending()
		self.physics.linearVelocity = (0,0)

	def want_attack(self, direction):
		if(not hasattr(self, 'delayed_attack') or not self.delayed_attack.active()):
			self.delayed_attack = self.reactor.callLater(
				0.5*self.attack_speed,
				self.commit_attack,
				direction
			)

	def commit_attack(self, direction):
		arrow = Arrow(direction, self.arrows_speed, self, reactor=self.reactor)
		self.arrows_shot.append(arrow)

	def cancel_pending(self):
		if(hasattr(self, 'delayed_attack') and self.delayed_attack.active()):
			self.delayed_attack.cancel()


class Arrow(SelfDestructable):
	def __init__(self, direction, speed, owner, **kwargs):
		self.owner = owner
		self.physics = self.owner.world.physics.CreateDynamicBody(
			position=(owner.physics.position.x, owner.physics.position.y)
		)
		self.physics.CreatePolygonFixture(box=(0.1, 0.1), density=1, friction=0.01)
		super(Arrow, self).__init__(
			owner.world,
			type="arrow",
			lifetime=5.0,
			**kwargs)

	def destroy(self):
		self.owner.arrows_shot.remove(self)
		self.world.physics.DestroyBody(self.physics)
		super(Arrow, self).destroy()

