import tmxlib

class World():
	def __init__(self, map_filename):
		self.map = tmxlib.Map.open(map_filename)
		self.layers = dict()
		for layer in self.map.layers:
			self.layers[layer.name] = layer

	def get_spawn_points():
		return self.layers['spawn'].all_objects()