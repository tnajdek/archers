import os
from archers.world import World, directions
from archers.player import Player
from twisted.internet import task
from .base import BaseTestCase
from archers.interface import FullUpdateMessage, Connection
import settings


class TestInterface(BaseTestCase):

	def setUp(self):
		super(TestInterface, self).setUp()
		path = os.path.dirname(os.path.os.path.realpath(__file__))
		path = os.path.join(path, 'assets/test1.tmx')
		self.world = World(path)
		self.spawn_point = self.world.get_object_by_name('spawn1')
		self.world_update_task = task.LoopingCall(self.world.step)
		self.world_update_task.clock = self.clock
		self.world_update_task.start(settings.TIME_STEP)
		self.connection = Connection(self.world)

	def tearDown(self):
		self.world_update_task.stop()

	def test_generate_initial_update(self):
		items_expected = self.world.object_lookup_by_name
		# my linter says line below has syntax error.
		items_expected = {k: v for k, v in items_expected.iteritems() if hasattr(v, 'physics')}
		update = self.connection.get_full_update()
		self.assertIsInstance(update, FullUpdateMessage)
		for item_name, item in items_expected.iteritems():
			data = update.items[item.id]
			self.assertEqual(data['name'], item_name)
			self.assertEqual(data['id'], item.id)
			# self.assertEqual(item['x'], items_expected[item_name].physics.position.x)
			# self.assertEqual(item['y'], items_expected[item_name].physics.position.y)
			# self.assertEqual(item['direction'], items_expected[item_name].physics.angle)
			self.assertEqual(data['center'], False)
			# item.spritesheet = 

	def test_get_frame(self):
		self.player = Player(self.world, reactor=self.clock)
		self.player.spawn(self.spawn_point)
		self.connection.get_full_update()

		frame = self.connection.get_frame()

		items_expected = self.world.object_lookup_by_name
		items_expected = {k: v for k, v in items_expected.iteritems() if hasattr(v, 'physics')}
		for item_name, item in items_expected.iteritems():
			data = frame.items[item.id]
			self.assertEqual(data['x'], item.physics.position.x)
			self.assertEqual(data['y'], item.physics.position.y)
			self.assertEqual(data['direction'], item.physics.angle)
			# self.assertEqual(data['direction'], item.physics.angle)

		self.clock.advance(50)
		frame = self.connection.get_frame()
		#nothing has changed!
		self.assertEqual(len(frame.items.keys()), 0)
		self.player.want_move(directions['south'])
		self.advance_clock(50)
		frame = self.connection.get_frame()
		self.assertEqual(len(frame.items.keys()), 1)
		player_data = frame.items.popitem()[1]
		self.assertEqual(player_data['x'], self.player.physics.position.x)
		self.assertEqual(player_data['y'], self.player.physics.position.y)
		self.assertEqual(player_data['direction'], self.player.physics.angle)
