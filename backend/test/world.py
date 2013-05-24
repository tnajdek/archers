import unittest
import time
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.os.path.realpath(__file__))))
# import ipdb; ipdb.set_trace()

from archers.world import World
# from archers.player import Player




class TestWorldGeneration(unittest.TestCase):

	def setUp(self):
		path = os.path.dirname(os.path.os.path.realpath(__file__))
		path = os.path.join(path, 'assets/test1.tmx')
		self.world = World(path)
		# self.player = Player()
		# self.spawnPoint = self.world.getSpawnPoints()[0]
		# self.world.spawn(self.player, self.spawnPoint)


	def spawn_points_found(self):
		spawn_point = self.map.get_spawn_points()[0]
		self.assertEqual(spawn_point.x, 2)
		self.assertEqual(spawn_point.y, 3)
	

	def test(self):
		pass

	# def player_spawned(self):
	# 	self.player.spatial.x == self.spawnPoint.spatial.x
	# 	self.player.spatial.y == self.spawnPoint.spatial.y

	# doesn't belong here
	# def move_player(self):
	# 	"""
	# 	Check if player object moves in the right direction
	# 	after applying force
	# 	"""
	# 	self.player.physics.applyForce(10, 0)
	# 	time.sleep(1)
	# 	self.player.physics.setLinearVelocity(0, 0)
	# 	self.assertGreater(self.player.spatial.x, self.spawnPoint.spatial.x)
	# 	self.assertEqual(self.player.spatial.y, self.spawnPoint.spatial.y)

if __name__ == '__main__':
    unittest.main(verbosity=5)