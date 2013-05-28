from Box2D import *
from archers.world import directions


class Player():
	speed = 50
	def __init__(self, world):
		self.world = world

	def spawn(self, spawnPoint):
		self.physics = self.world.physics.CreateDynamicBody(
			position=(spawnPoint.x, spawnPoint.y)
		)
		self.physics.CreatePolygonFixture(box=(1, 1), density=1, friction=0.3)
		# self.physics.ApplyTorque(5.0, wake=True)

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

	def wat_attack(self):
		pass
