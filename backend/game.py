#!/usr/bin/env python2
from twisted.internet import reactor, task, stdio
# from autobahn.websocket import listenWS
# from autobahn.wamp import WampServerFactory, WampServerProtocol, exportRpc
from archers.world import World
from archers.interface import Connection, pack_messages, unpack_mesages
from archers.cmd import CmdInterface
import settings
from Box2D import *

# from twisted.internet import reactor
from autobahn.websocket import WebSocketServerFactory, WebSocketServerProtocol, listenWS
import logging
import simplejson

logging.basicConfig(format='%(asctime)s %(message)s',
	datefmt='%m/%d/%Y %I:%M:%S %p',
	filename='archers.log',
	level=settings.DEBUG and logging.DEBUG or logging.INFO
)


class UserCommunication(WebSocketServerProtocol):
	# def __init__(self, world, *args, **kwargs):
	# 	self.world = world
	# 	# WebSocketServerProtocol.__init__(self)

	def onMessage(self, msg, binary):
		if(binary):
			messages = unpack_mesages(msg)
			for msg in messages:
				self.interface.trigger('useraction', msg)
		else:
			try:
				msg = simplejson.loads(msg)
			except Exception:
				log.warning("Unable to decode meta msg %s coming from the client" % msg)
			self.interface.trigger('metamsg', msg)

	def onOpen(self):
		self.interface = Connection(self.factory.world)
		self.interface.on('update', self.send_messages)
		self.interface.on('frame', self.send_messages)
		self.interface.on('remove', self.send_messages)
		self.interface.on('meta', self.broadcast_meta_update)
		self.factory.register(self)

		#force initial full update
		self.interface.on_update(self.factory.world)
		#then send all meta, probably should live somewhere else
		for conn in self.factory.clients:
			msg = simplejson.dumps(conn.interface.meta, separators=(',', ':'))
			self.sendMessage(msg)

	def connectionLost(self, reason):
		WebSocketServerProtocol.connectionLost(self, reason)
		self.factory.unregister(self)

	def onClose(self, wasClean, code, reason):
		try:
			self.interface.trigger('disconnect')
		except Exception:
			#could be the browser never estabilished connection right. ignore
			pass

	def send_messages(self, messages):
		if(len(messages)):
			self.sendMessage(pack_messages(messages), True)

	def broadcast_meta_update(self, meta):
		msg = simplejson.dumps(meta, separators=(',', ':'))
		self.factory.broadcast(msg)


class BroadcastServerFactory(WebSocketServerFactory):
	def __init__(self, url, debug=False, debugCodePaths=False):
		WebSocketServerFactory.__init__(self, url, debug=debug, debugCodePaths=debugCodePaths)
		self.clients = []

	def register(self, client):
		if not client in self.clients:
			self.clients.append(client)

	def unregister(self, client):
		if client in self.clients:
			self.clients.remove(client)

	def broadcast(self, msg):
		for c in self.clients:
			c.sendMessage(msg)

class Archers():
	def init_networking(self):
		factory = BroadcastServerFactory("ws://localhost:9000")
		factory.world = self.world
		factory.protocol = UserCommunication
		listenWS(factory)
		logging.info("Server is listening on %s:%i" % (factory.host, factory.port))

	def init_world(self):
		self.world = World('../resources/map.tmx')
		task.LoopingCall(self.world.networking_step).start(settings.NETWORKING_STEP)
		task.LoopingCall(self.world.processing_step).start(settings.PROCESSING_STEP)
		task.clock = self.reactor

	def init_debug_renderer(self):
		"""
		Import debug renderer (which in turn imports pygame)
		Add task to the reactor to update debug screen
		Only works when GUI is available
		Don't use in production
		"""
		from archers.debug import Renderer
		self.renderer = Renderer(self.world)
		task.LoopingCall(self.renderer.render_frame).start(settings.PROCESSING_STEP)

	def init_cmd_support(self):
		stdio.StandardIO(CmdInterface(self.world))

	def start(self, reactor=reactor):
		self.reactor = reactor
		self.init_world()
		self.init_networking()
		if(settings.DEBUG):
			self.init_debug_renderer()
			logging.debug("Debug mode ON")
		self.init_cmd_support()
		self.reactor.run()
		#reactor.run will block till ctrl+c is pressed or crash is detected
		logging.info("Shutting down...")


if __name__ == '__main__':
	Archers().start()
