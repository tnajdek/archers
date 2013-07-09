import os
from archers.world import World, directions, rotations
from archers.archer import Archer
from twisted.internet import task
from .base import BaseTestCase
from archers.interface import UpdateMessage, FrameMessage, Connection, pack_messages, unpack_mesages
import struct
import settings


class TestInterface(BaseTestCase):

	def setUp(self):
		super(TestInterface, self).setUp()
		path = os.path.dirname(os.path.os.path.realpath(__file__))
		path = os.path.join(path, 'assets/test1.tmx')
		self.world = World(path)
		self.spawn_point = self.world.get_object_by_name('spawn1')
		self.world_update_task = task.LoopingCall(self.world.processing_step)
		self.world_update_task.clock = self.clock
		self.world_update_task.start(settings.PROCESSING_STEP)
		self.connection = Connection(self.world)

	def tearDown(self):
		self.world_update_task.stop()

	def get_items_expected(self):
		# items_expected = self.world.object_lookup_by_name
		items_expected = self.world.object_index
		items_expected = {k: v for k, v in items_expected.items() if hasattr(v, 'physics')}
		return items_expected

	# redundant, just reset the counter on_update?
	# def test_generate_initial_update(self):
	# 	items_expected = self.get_items_expected()
	# 	update = self.connection.get_full_update()
	# 	self.assertEqual(len(update), len(items_expected))

	# 	for message in update:
	# 		self.assertIsInstance(message, UpdateMessage)
	# 		matching_expected_item = items_expected.pop(message['id'])
	# 		self.assertEqual(data['id'], item.id)
	# 		self.assertEqual(data['center'], False)

	def test_get_frame(self):
		self.archer = Archer(self.world, reactor=self.clock)
		self.archer.spawn(self.spawn_point)

		frame = self.connection.get_frame()
		items_expected = self.get_items_expected()

		self.assertEqual(len(frame), len(items_expected))

		for message in frame:
			matching_expected_item = items_expected.pop(message['id'])
			self.assertEqual(message['x'], int(settings.PPM*matching_expected_item.physics.position.x))
			self.assertEqual(message['y'], int(settings.PPM*matching_expected_item.physics.position.y))
			self.assertEqual(message['direction'], matching_expected_item.physics.angle)

		self.assertEqual(len(items_expected), 0)

		self.clock.advance(50)
		frame = self.connection.get_frame()
		#nothing has changed!
		self.assertEqual(len(frame), 0)
		self.archer.want_move(directions['south'])
		self.advance_clock(50)
		frame = self.connection.get_frame()
		self.assertEqual(len(frame), 1)
		message = frame.pop()
		self.assertEqual(message['x'], int(settings.PPM*self.archer.physics.position.x))
		self.assertEqual(message['y'], int(settings.PPM*self.archer.physics.position.y))
		self.assertEqual(message['direction'], self.archer.physics.angle)

	def test_get_update(self):
		#oh dear python2, why u have no nonlocal?
		out = {'result': None}

		def callback(items, _context=None):
			out['result'] = items

		self.connection.on('update', callback)
		frame = self.connection.get_frame()
		self.clock.advance(1)

		items_expected = self.get_items_expected()
		update = out['result']
		self.assertEqual(len(update), len(items_expected))
		for message in update:
			self.assertIsInstance(message, UpdateMessage)
			matching_expected_item = items_expected.pop(message['id'])
			self.assertEqual(message['id'], matching_expected_item.id)
			# self.assertEqual(message['center'], False)
			#TEST MORE
		self.assertEqual(len(items_expected), 0)

		self.clock.advance(1)
		update = out['result']
		self.assertEqual(len(update), 0)
		self.archer = Archer(self.world, reactor=self.clock)
		self.archer.spawn(self.spawn_point)
		self.clock.advance(1)
		update = out['result']
		self.assertEqual(len(update), 1)

	def get_fake_msg(self, id=1, x=1, y=2, direction=rotations['south'], state=10):
		msg = FrameMessage()
		msg['id'] = id
		msg['x'] = x
		msg['y'] = y
		msg['direction'] = direction
		msg['state'] = state
		return msg

	def test_packing(self):
		msg = self.get_fake_msg()
		packed = msg.pack()
		self.assertEqual(packed[0:4], struct.pack('!I', 1))
		self.assertEqual(packed[4:8], struct.pack('!I', 1))
		self.assertEqual(packed[8:12], struct.pack('!I', 2))
		self.assertEqual(packed[12:13], struct.pack('!B', 2))
		self.assertEqual(packed[13:14], struct.pack('!B', 10))


	def test_dehydration(self):
		dehydrated_item = [1, 1, 2, 2, 10]
		msg = FrameMessage.from_dehydrated(dehydrated_item)
		self.assertEqual(msg['id'], 1)
		self.assertEqual(msg['x'], 1)
		self.assertEqual(msg['y'], 2)
		self.assertEqual(msg['direction'], rotations['south'])
		self.assertEqual(msg['state'], 10)

	def test_unpacking(self):
		packed = '\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x02\x02\n'
		msg = FrameMessage.from_packed(packed)
		msg = msg
		self.assertEqual(msg['id'], 1)
		self.assertEqual(msg['x'], 1)
		self.assertEqual(msg['y'], 2)
		self.assertEqual(msg['direction'], directions['south'])
		self.assertEqual(msg['state'], 10)

	def test_message_packing(self):
		msg = self.get_fake_msg()
		msg2 = self.get_fake_msg(id=2, x=5, y=10)
		result = pack_messages([msg, msg2])
		expected_byte_length = 1 + 2 * msg.get_byte_length()
		self.assertEqual(len(result), expected_byte_length)

	def test_message_unpacking(self):
		packed_msgs = '\x01\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x02\x02\n\x00\x00\x00\x02\x00\x00\x00\x05\x00\x00\x00\n\x02\n'
		messages = unpack_mesages(packed_msgs)
		self.assertEqual(len(messages), 2)
		self.assertEqual(messages[0]['id'], 1)
		self.assertEqual(messages[0]['x'], 1)
		self.assertEqual(messages[1]['id'], 2)
		self.assertEqual(messages[1]['x'], 5)

	def test_update_message_packing(self):
		msg = UpdateMessage()
		msg['id'] = 12
		msg['entity_type'] = 'Collidable'
		msg['width'] = 300
		msg['height'] = 42
		msg['x'] = 5
		msg['y'] = 10
		msg['direction'] = rotations['west']
		msg['state'] = 1
		packed = msg.pack()
		unpacked = UpdateMessage.from_packed(packed)
		self.assertEqual(msg, unpacked)
