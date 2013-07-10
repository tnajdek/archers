import os
from archers.world import World, directions, rotations
from archers.archer import Archer
from twisted.internet import task
from .base import BaseTestCase
from archers.interface import Connection, pack_messages, unpack_mesages
from archers.messages import Message, UpdateMessage, DirectionMessageMixin, message_types
import struct
import settings


# create FakeMessage which we will use for testing
class FakeMessage(Message, DirectionMessageMixin):
	schema = {
		'id': 255,
		'format': ['x', 'y', 'direction'],
		'byteformat': '!IfB'
	}

# and inject it so that it's recognized
message_types[255] = FakeMessage

class TestInterface(BaseTestCase):

	def setUp(self):
		super(TestInterface, self).setUp()
		path = os.path.dirname(os.path.os.path.realpath(__file__))
		path = os.path.join(path, 'assets/test1.tmx')
		self.world = World(path)
		self.spawn_point = self.world.get_object_by_name('spawn1')
		
		self.world_update_task = task.LoopingCall(self.world.processing_step)
		self.world_update_task.clock = self.clock
		self.world_update_task.start(1.0/30)

		self.networking_task = task.LoopingCall(self.world.networking_step)
		self.networking_task.clock = self.clock
		self.networking_task.start(1.0/30)
		
		self.connection = Connection(self.world)
		self.last_callback_data = None

	def tearDown(self):
		self.world_update_task.stop()
		self.networking_task.stop()

	def get_items_expected(self, expected_attr):
		# items_expected = self.world.object_lookup_by_name
		items_expected = self.world.object_index
		items_expected = {k: v for k, v in items_expected.items() if hasattr(v, expected_attr)}
		return items_expected

	def callback(self, *args, **kwargs):
		self.last_callback_data = list(*args)

	def get_last_callback_arguments(self):
		tmp = self.last_callback_data
		self.last_callback_data = None
		return tmp

	def test_get_frame(self):
		self.archer = Archer(self.world, reactor=self.clock)
		self.archer.spawn(self.spawn_point)
		self.connection.on('frame', self.callback)
		self.clock.advance(1)
		frame = self.get_last_callback_arguments()
		items_expected = self.get_items_expected('get_frame_message')
		self.assertEqual(len(frame), len(items_expected))

		for message in frame:
			matching_expected_item = items_expected.pop(message['id'])
			self.assertEqual(message['x'], int(settings.PPM*matching_expected_item.get_position()['x']))
			self.assertEqual(message['y'], int(settings.PPM*matching_expected_item.get_position()['y']))
			self.assertEqual(message['direction'], matching_expected_item.get_direction())

		self.assertEqual(len(items_expected), 0)

			
		self.clock.advance(1)
		frame = self.get_last_callback_arguments()
		# Nothing has changed!
		self.assertEqual(len(frame), 0)
		self.archer.want_move(directions['south'])
		self.advance_clock(1)
		frame = self.get_last_callback_arguments()
		self.assertEqual(len(frame), 1)
		message = frame.pop()
		self.assertEqual(message['x'], int(settings.PPM*self.archer.get_position()['x']))
		self.assertEqual(message['y'], int(settings.PPM*self.archer.get_position()['y']))
		self.assertEqual(message['direction'], self.archer.get_direction())

	def test_get_update(self):
		self.connection.on('update', self.callback)
		self.clock.advance(1)
		items_expected = self.get_items_expected('get_update_message')
		update = self.get_last_callback_arguments()
		self.assertEqual(len(update), len(items_expected))
		for message in update:
			self.assertIsInstance(message, UpdateMessage)
			matching_expected_item = items_expected.pop(message['id'])
			self.assertEqual(message['id'], matching_expected_item.id)
			# self.assertEqual(message['center'], False)
			#TEST MORE
		self.assertEqual(len(items_expected), 0)

		self.clock.advance(1)
		update = self.get_last_callback_arguments()


		self.assertIsNone(update)
		self.archer = Archer(self.world, reactor=self.clock)
		self.archer.spawn(self.spawn_point)
		self.clock.advance(1)
		update = self.get_last_callback_arguments()
		self.assertEqual(len(update), 1)

	def get_fake_msg(self, x=1, y=3.33, direction=directions['south']):
		msg = FakeMessage()
		msg['x'] = x
		msg['y'] = y
		msg['direction'] = direction
		return msg

	def test_packing(self):
		msg = self.get_fake_msg()
		packed = msg.pack()
		self.assertEqual(packed[0:4], struct.pack('!I', 1))
		self.assertEqual(packed[4:8], struct.pack('!f', 3.33))
		self.assertEqual(packed[8:9], struct.pack('!B', DirectionMessageMixin.direction_lookup[directions['south']]))


	def test_dehydration(self):
		x = 12
		y = 4.44
		dir = DirectionMessageMixin.direction_lookup[directions['west']]
		dehydrated_item = [x, y, dir]
		msg = FakeMessage.from_dehydrated(dehydrated_item)

		self.assertEqual(msg['x'], x)
		self.assertEqual(msg['y'], y)
		self.assertEqual(msg['direction'], directions['west'])

	def test_unpacking(self):
		# packed = '\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x02\x02\n'
		x = 12
		y = 7.77
		dir = DirectionMessageMixin.direction_lookup[directions['west']]

		packed = struct.pack("!I", x) + struct.pack("!f", y) + struct.pack("!B", dir) + "\n"
		msg = FakeMessage.from_packed(packed)
		self.assertEqual(msg['x'], x)
		self.assertAlmostEqual(msg['y'], y, places=4)
		self.assertEqual(msg['direction'], directions['west'])

	def test_message_packing(self):
		msg = self.get_fake_msg()
		msg2 = self.get_fake_msg(x=5, direction=directions['east'])
		result = pack_messages([msg, msg2])
		expected_byte_length = 1 + 2 * msg.get_byte_length()
		self.assertEqual(len(result), expected_byte_length)

	def test_message_unpacking(self):
		x1 = 12
		y1 = 4.44
		dir1 = DirectionMessageMixin.direction_lookup[directions['west']]
		packed = struct.pack("!I", x1) + struct.pack("!f", y1) + struct.pack("!B", dir1)
		x2 = 42
		y2 = 9.987654
		dir2 = DirectionMessageMixin.direction_lookup[directions['north']]
		packed = packed + struct.pack("!I", x2) + struct.pack("!f", y2) + struct.pack("!B", dir2) + "\n"

		packed = struct.pack("!B", 255) + packed

		messages = unpack_mesages(packed, message_types=message_types)
		self.assertEqual(len(messages), 2)
		self.assertEqual(messages[0]['x'], x1)
		self.assertAlmostEqual(messages[0]['y'], y1, places=4)
		self.assertEqual(messages[0]['direction'], directions['west'])
		self.assertEqual(messages[1]['x'], x2)
		self.assertAlmostEqual(messages[1]['y'], y2, places=4)
		self.assertEqual(messages[1]['direction'], directions['north'])

	def test_eating_own_dog_food(self):
		msg = self.get_fake_msg(y=1.0) 
		packed = msg.pack()
		unpacked = FakeMessage.from_packed(packed)
		self.assertEqual(msg, unpacked)
