#!/usr/bin/env python2
import os
import sys
from twisted.trial import unittest
from twisted.internet import task

sys.path.append(os.path.dirname(os.path.dirname(os.path.os.path.realpath(__file__))))

from archers.world import World, directions
from archers.player import Player
import settings


class TestPlayer(unittest.TestCase):
	def setUp(self):
		self.clock = task.Clock()
		path = os.path.dirname(os.path.os.path.realpath(__file__))
		path = os.path.join(path, 'assets/test1.tmx')
		self.world = World(path)
		self.spawn_point = self.world.get_spawn_points()[0]
		self.player = Player(self.world)
		self.player.spawn(self.spawn_point)
		self.world_update_task = task.LoopingCall(self.world.step)
		self.world_update_task.clock = self.clock
		self.world_update_task.start(settings.TIME_STEP)

	def tearDown(self):
		self.world_update_task.stop()

	def test_player_spawned(self):
		self.assertEqual(self.spawn_point.x, self.player.physics.position.x)
		self.assertEqual(self.spawn_point.y, self.player.physics.position.y)

	def test_player_moved(self):
		self.player.want_move(directions['north'])
		for i in range(120):
			self.clock.advance(settings.TIME_STEP * i)
		self.assertGreater(self.player.physics.position.y, self.spawn_point.y)

if __name__ == '__main__':
	unittest.main()