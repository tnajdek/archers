from twisted.trial import unittest
from twisted.internet import task
import settings


class BaseTestCase(unittest.TestCase):
	def setUp(self):
		self.clock = task.Clock()

	def advance_clock(self, steps, clock=None):
		if(not clock):
			clock = self.clock
		for i in range(steps):
			clock.advance(1.0/30)
