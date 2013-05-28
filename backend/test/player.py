#!/usr/bin/env python2
import os
from twisted.trial import unittest
from twisted.internet import task
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
		self.world_update_task = task.LoopingCall(self.world.step)
		self.world_update_task.clock = self.clock
		self.world_update_task.start(settings.TIME_STEP)
		self.player = Player(self.world)
		self.player.spawn(self.spawn_point)

	def advance_clock(self, steps):
		for i in range(steps):
			self.clock.advance(settings.TIME_STEP*steps)

	def tearDown(self):
		self.player.destroy()
		self.world_update_task.stop()

	def test_player_spawned(self):
		self.assertEqual(self.spawn_point.x, self.player.physics.position.x)
		self.assertEqual(self.spawn_point.y, self.player.physics.position.y)

	def test_player_moved(self):
		self.player.want_move(directions['north'])
		self.advance_clock(1)
		self.assertLess(self.player.physics.position.y, self.spawn_point.y)

	def test_player_collides(self):
		self.player.want_move(directions['east'])
		self.advance_clock(100)
		self.assertLess(self.player.physics.position.x, 6.0)
		self.assertGreater(self.player.physics.position.x, self.spawn_point.x)




if __name__ == '__main__':
	unittest.main()