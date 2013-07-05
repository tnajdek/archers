import os
from twisted.internet import task
from archers.world import World, directions
from archers.archer import Archer
import settings
from .base import BaseTestCase


class TestArcher(BaseTestCase):
	def setUp(self):
		super(TestArcher, self).setUp()
		path = os.path.dirname(os.path.os.path.realpath(__file__))
		path = os.path.join(path, 'assets/test1.tmx')
		self.world = World(path)
		self.spawn_point = self.world.get_spawn_points()[0]
		self.world_update_task = task.LoopingCall(self.world.step)
		self.world_update_task.clock = self.clock
		self.world_update_task.start(settings.TIME_STEP)
		self.archer = Archer(self.world, reactor=self.clock)
		self.archer.spawn(self.spawn_point)

	def tearDown(self):
		self.archer.destroy()
		self.world_update_task.stop()

	def count_archer_arrows(self, archer):
		arrows = self.world.get_objects_by_type('arrow')
		count = 0
		for arrow in arrows:
			if(arrow.owner == archer):
				count = count + 1
		return count

	def get_archer_arrows(self, archer):
		arrows = self.world.get_objects_by_type('arrow')
		archer_arrows = list()
		for arrow in arrows:
			if(arrow.owner == archer):
				archer_arrows.append(arrow)
		return archer_arrows

	def test_archer_spawned(self):
		self.assertEqual(self.spawn_point.x, self.archer.physics.position.x)
		self.assertEqual(self.spawn_point.y, self.archer.physics.position.y)

	def test_archer_moved(self):
		self.archer.want_move(directions['north'])
		self.advance_clock(1)
		self.assertLess(self.archer.physics.position.y, self.spawn_point.y)

	def test_archer_collides(self):
		self.archer.want_move(directions['east'])
		self.advance_clock(100)
		self.assertLess(self.archer.physics.position.x, 6.0)
		self.assertGreater(self.archer.physics.position.x, self.spawn_point.x)

	def test_archer_shoots(self):
		self.archer.want_attack(directions['south'])
		self.advance_clock(40)
		self.assertEqual(self.count_archer_arrows(self.archer), 1)
		self.advance_clock(1000)
		self.assertEqual(self.count_archer_arrows(self.archer), 0)

	def test_arrow_flies(self):
		self.archer.want_attack(directions['south'])
		self.advance_clock(40)
		arrow = self.get_archer_arrows(self.archer)[0]
		self.assertEqual(self.archer.physics.position.x, arrow.physics.position.x)
		archer_position_plus_2m = self.archer.physics.position + directions['south']*2
		self.assertGreater(arrow.physics.position.y, archer_position_plus_2m.y)

	def test_arrow_collides(self):
		self.archer.want_attack(directions['east'])
		self.advance_clock(40)
		arrow = self.get_archer_arrows(self.archer)[0]
		self.assertLess(arrow.physics.position.x, 6.0)
		self.assertGreater(arrow.physics.position.x, self.archer.physics.position.x)

	def test_archer_kills_archer(self):
		attacker_spawn = self.world.get_object_by_name('spawn2')
		defender_spawn = self.world.get_object_by_name('spawn3')
		attacker = Archer(self.world, name="attacker", reactor=self.clock)
		defender = Archer(self.world, name="defender", reactor=self.clock)
		attacker.spawn(attacker_spawn)
		defender.spawn(defender_spawn)

		attacker.want_attack(directions['south'])
		self.advance_clock(1)
		self.assertEqual(attacker.state, "shooting")
		self.assertEqual(defender.state, "standing")
		self.advance_clock(50)
		self.assertEqual(attacker.state, "standing")
		self.assertEqual(defender.state, "dying")
		self.advance_clock(250)
		self.assertEqual(defender.state, "dead")

