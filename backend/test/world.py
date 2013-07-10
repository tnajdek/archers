import os
from archers.world import World
from .base import BaseTestCase


class TestWorldGeneration(BaseTestCase):

	def setUp(self):
		path = os.path.dirname(os.path.os.path.realpath(__file__))
		path = os.path.join(path, 'assets/test1.tmx')
		self.world = World(path)

	def test_spawn_points_found(self):
		spawn_point = self.world.get_spawn_points()[0]
		self.assertEqual(spawn_point.x, 2)
		self.assertEqual(spawn_point.y, 3)

	def test_collidables_created(self):
		barrel_width = 1.0
		barrel_height = 1.312
		barrel_x = 6.0
		barrel_y = 2.688

		barrel = self.world.get_objects_by_type('collidable')[0]
		self.assertAlmostEqual(barrel.get_position()['x'], barrel_x+0.5*barrel_width, places=3)
		self.assertAlmostEqual(barrel.get_position()['y'], barrel_y+0.5*barrel_height, places=3)