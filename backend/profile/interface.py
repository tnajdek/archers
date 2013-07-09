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
		path = os.path.dirname(os.path.os.path.realpath(__file__))
		path = os.path.join(path, '../../resources/map.tmx')
		self.world = World(path)
		self.spawn_point = self.world.get_object_by_name('spawn1')
		self.world_update_task = task.LoopingCall(self.world.processing_step)
		self.world_update_task.clock = self.clock
		self.world_update_task.start(settings.PROCESSING_STEP)
		self.connection = Connection(self.world)

	def test_get_frame_speed(self):
		archers = list()
		for i in range(50):
			archer = Archer(self.world, reactor=self.clock)
			archer.spawn(self.spawn_point)
			archer.want_move(directions['south'])
			archers.append(archer)
		self.pr.enable()
		for i in range(1000):
			self.connection.get_frame()
		self.pr.disable()
		self.ps = pstats.Stats(self.pr)
		print self.ps.print_stats()

	# def test
