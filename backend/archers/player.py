from Box2D import *
from archers.world import WorldObject


class Player(WorldObject):
	default_type = 'player'

	def __init__(self, world):
		self.speed = 50
		self.arrows_shot = list()
		super(Player, self).__init__(world, type="player")

	def spawn(self, spawn_point):
		self.physics = self.world.physics.CreateDynamicBody(
			position=(spawn_point.x, spawn_point.y)
		)
		self.physics.CreatePolygonFixture(box=(1, 1), density=1, friction=0.3)

	def destroy(self):
		self.world.physics.DestroyBody(self.physics)

	def want_move(self, direction):
		speed_vector = direction*self.speed
		self.physics.ApplyLinearImpulse(
			impulse=self.physics.GetWorldVector(speed_vector),
			point=self.physics.position,
			wake=True
		)

	def want_stop(self):
		self.physics.setLinearVelocity(0, 0)

	def want_attack(self):
		pass


class SelfDestructable(WorldObject):
	def __init__(self, *args, **kwargs):
		pass


class Arrow(SelfDestructable):
	pass
