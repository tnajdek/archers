import tmxlib
from Box2D import *


class World():
	def __init__(self, map_filename):
		self.map = tmxlib.Map.open(map_filename)
		self.layers = dict()
		for layer in self.map.layers:
			self.layers[layer.name] = layer
		self.physics = b2World(gravity=(0, 0))
		self.build_collidable_bodies(self.layers['collision'])

	def build_collidable_bodies(self, layer):
		for colidable in layer.all_objects():
			self.physics.CreateStaticBody(
				position=(colidable.x, colidable.y),
				shapes=b2PolygonShape(box=colidable.size),
			)

	def get_spawn_points(self):
		return self.layers['spawn'].all_objects()

	def step(self):
		self.physics.Step(1.0/60, 10, 10)