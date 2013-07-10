from twisted.internet import task
import os
import cProfile
import pstats
import settings
from test.base import BaseTestCase
from archers.archer import Archer
from archers.interface import Connection
from archers.world import World, directions


class ProfileInterface(BaseTestCase):
	def setUp(self):
		super(ProfileInterface, self).setUp()
		self.pr = cProfile.Profile()
		self.path = os.path.dirname(os.path.os.path.realpath(__file__))
		path = os.path.join(self.path, '../../resources/map.tmx')
		self.world = World(path)
		self.spawn_point = self.world.get_object_by_name('spawn1')

		self.world_update_task = task.LoopingCall(self.world.processing_step)
		self.world_update_task.clock = self.clock
		self.world_update_task.start(1.0/30)

		self.networking_task = task.LoopingCall(self.world.networking_step)
		self.networking_task.clock = self.clock
		self.networking_task.start(1.0/30)

	def process_stats(self, filename):
		self.ps = pstats.Stats(self.pr)
		f = open(os.path.join(self.path, 'data', filename), 'w')
		pstats.Stats(self.pr, stream=f).strip_dirs().sort_stats('cumulative').print_stats()
		f.close()
		return "%i calls" % self.ps.total_calls, "%.3f sec" % self.ps.total_tt


	def test_get_frame(self):
		""" Test raw execution performance of the 'get_frame'"""
		self.connection = Connection(self.world)
		archers = list()
		for i in range(50):
			archer = Archer(self.world, reactor=self.clock)
			archer.spawn(self.spawn_point)
			archer.want_move(directions['south'])
			archers.append(archer)
		self.pr.enable()
		for i in range(100):
			self.connection.get_frame()
		self.pr.disable()
		print self.process_stats('test_get_frame.txt')

	def test_building_frames(self):
		""" Test performance of building frame for many players """
		connections = list
		for i in range(100):
			connection = Connection(self.world)
			connection.get_update()

		self.pr.enable()
		self.clock.advance(1)
		self.pr.disable()
		print self.process_stats('test_building_frames.txt')

	def test_get_update(self):
		""" Test raw execution performance of the 'get_update'"""
		self.connection = Connection(self.world)
		archers = list()
		for i in range(50):
			archer = Archer(self.world, reactor=self.clock)
			archer.spawn(self.spawn_point)
			archer.want_move(directions['south'])
			archers.append(archer)
		self.pr.enable()
		for i in range(100):
			self.connection.get_update()
		self.pr.disable()
		print self.process_stats('test_get_update.txt')

	def test_buidling_updates(self):
		""" Test performance of building update messages for many players"""
		connections = list
		for i in range(100):
			connection = Connection(self.world)
			connection.get_frame()

		self.pr.enable()
		self.clock.advance(1)
		self.pr.disable()
		print self.process_stats('test_buidling_updates.txt')

