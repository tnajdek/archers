import unittest
import time

from archers.world import World
from archers.player import Player


class TestWorldGeneration(unittest.TestCase):

	def setUp(self):
		self.world = World('test-assets/small.tmx')
		self.player = Player()
		self.spawnPoint = self.world.getSpawnPoints()[0]
		self.world.spawn(self.player, self.spawnPoint)

	def player_spawned(self):
		self.player.spatial.x == self.spawnPoint.spatial.x
		self.player.spatial.y == self.spawnPoint.spatial.y

	def move_player(self):
		"""
		Check if player object moves in the right direction
		after applying force
		"""
		self.player.physics.applyForce(10, 0)
		time.sleep(1)
		self.player.physics.setLinearVelocity(0, 0)
		self.assertGreater(self.player.spatial.x, self.spawnPoint.spatial.x)
		self.assertEqual(self.player.spatial.y, self.spawnPoint.spatial.y)
