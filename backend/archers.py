#!/usr/bin/env python2
from twisted.internet import reactor, task
from autobahn.websocket import listenWS
from autobahn.wamp import WampServerFactory, WampServerProtocol, exportRpc
from archers.world import World
import settings
from Box2D import *


class UserActionsHandler(WampServerProtocol):

	@exportRpc
	def move(self, direction):
		#self.session_id
		pass

	def stop(self):
		pass

	def attack(self, direction):
		pass

	def onSessionOpen(self):
		self.registerForRpc(self, "%s%s#" % (settings.DOMAIN, 'rpc'))
		self.registerForPubSub("%s%s#" % (settings.DOMAIN, 'pubsub'))


class Archers():
	def init_networking(self):
		factory = WampServerFactory("ws://localhost:9000")
		factory.protocol = UserActionsHandler
		listenWS(factory)

	def init_world(self):
		self.world = World('../common/map.tmx')
		task.LoopingCall(self.world.step).start(settings.TIME_STEP)
		task.clock = self.reactor
		#spawn test
		# from archers. player import Player
		# self.player = Player(self.world)
		# self.player.spawn(self.world.get_spawn_points()[0])

	def init_debug_renderer(self):
		"""
		Import debug renderer (which in turn imports pygame)
		Add task to the reactor to update debug screen
		Only works when GUI is available
		Don't use in production
		"""
		from archers.debug import Renderer
		self.renderer = Renderer(self.world)
		task.LoopingCall(self.renderer.render_frame).start(settings.TIME_STEP)

	def start(self, reactor=reactor):
		self.reactor = reactor
		self.init_world()
		self.init_networking()
		if(settings.DEBUG):
			self.init_debug_renderer()
		self.reactor.run()


if __name__ == '__main__':
	archers = Archers()
	archers.start()
