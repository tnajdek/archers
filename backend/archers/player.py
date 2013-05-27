from Box2D import *


class Player():
	def __init__(self, world):
		self.world = world

	def spawn(self, spawnPoint):
		self.physics = self.world.physics.CreateDynamicBody(position=(spawnPoint.x,spawnPoint.y))
		self.physics.CreatePolygonFixture(box=(1,1), density=1, friction=0.3)
		# self.physics.ApplyForce(
		# 	force = self.physics.GetWorldVector(b2Vec2(100, 0)),
		#  	point = self.physics.position,
		#  	wake=True
		#  )
		# # self.physics.ApplyTorque(5.0, wake=True)
