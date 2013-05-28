#!/usr/bin/env python2
from twisted.trial import unittest
import os
from archers.world import World


class TestWorldGeneration(unittest.TestCase):

	def setUp(self):
		path = os.path.dirname(os.path.os.path.realpath(__file__))
		path = os.path.join(path, 'assets/test1.tmx')
		self.world = World(path)

	def test_spawn_points_found(self):
		spawn_point = self.world.get_spawn_points()[0]
		self.assertEqual(spawn_point.x, 2)
		self.assertEqual(spawn_point.y, 3)

	def test_collidables_created(self):
		barrel = self.world.get_objects_by_type('barrel')[0]
		self.assertEqual(barrel.physics.position.x, 6)
		self.assertEqual(barrel.physics.position.y, 3)