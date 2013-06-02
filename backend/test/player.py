import os
from twisted.internet import task
from archers.world import World, directions
from archers.player import Player
import settings
from .base import BaseTestCase


class TestPlayer(BaseTestCase):
	def setUp(self):
		super(TestPlayer, self).setUp()
		path = os.path.dirname(os.path.os.path.realpath(__file__))
		path = os.path.join(path, 'assets/test1.tmx')
		self.world = World(path)
		self.spawn_point = self.world.get_spawn_points()[0]
		self.world_update_task = task.LoopingCall(self.world.step)
		self.world_update_task.clock = self.clock
		self.world_update_task.start(settings.TIME_STEP)
		self.player = Player(self.world, reactor=self.clock)
		self.player.spawn(self.spawn_point)

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

	def test_player_shoots(self):
		self.player.want_attack(directions['south'])
		self.advance_clock(40)
		self.assertEqual(len(self.player.arrows_shot), 1)
		self.advance_clock(1000)
		self.assertEqual(len(self.player.arrows_shot), 0)

	def test_arrow_flies(self):
		self.player.want_attack(directions['south'])
		self.advance_clock(40)
		arrow = self.player.arrows_shot[0]
		self.assertEqual(self.player.physics.position.x, arrow.physics.position.x)
		player_position_plus_2m = self.player.physics.position + directions['south']*2
		self.assertGreater(arrow.physics.position.y, player_position_plus_2m.y)

	def test_arrow_collides(self):
		self.player.want_attack(directions['east'])
		self.advance_clock(40)
		arrow = self.player.arrows_shot[0]
		self.assertLess(arrow.physics.position.x, 6.0)
		self.assertGreater(arrow.physics.position.x, self.player.physics.position.x)

	def test_player_kills_player(self):
		attacker_spawn = self.world.get_object_by_name('spawn2')
		defender_spawn = self.world.get_object_by_name('spawn3')
		attacker = Player(self.world, name="attacker", reactor=self.clock)
		defender = Player(self.world, name="defender", reactor=self.clock)
		attacker.spawn(attacker_spawn)
		defender.spawn(defender_spawn)
		self.assertFalse(defender.dead)
		self.assertIsNotNone(defender.physics)
		attacker.want_attack(directions['south'])
		self.advance_clock(100)

		self.assertTrue(defender.dead)
		# self.assertIsNone(defender.physics)
		self.assertFalse(attacker.dead)
		self.assertIsNotNone(attacker.physics)





		
