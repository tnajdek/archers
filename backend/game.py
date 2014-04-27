#!/usr/bin/env python2
import argparse
from twisted.internet import reactor, task, stdio
# from autobahn.websocket import listenWS
# from autobahn.wamp import WampServerFactory, WampServerProtocol, exportRpc
from archers.world import World
from archers.interface import Connection, MessageCache, pack_messages, unpack_mesages
from archers.cmd import CmdInterface
import settings
from Box2D import *

# from twisted.internet import reactor
from autobahn.twisted.websocket import WebSocketServerFactory, WebSocketServerProtocol, listenWS
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

			if(not hasattr(self, "interface")):
				try:
					if(messages[0]['action'] == 'init'):
						self.onWantPlay()
				except (IndexError, KeyError):
					logging.warning("Got garbage message {}, discarding".format(msg))
			else:
				for msg in messages:
					self.interface.trigger('useraction', msg)
		else:
			try:
				msg = simplejson.loads(msg)
				self.interface.trigger('usermsg', msg)
			except Exception:
				#ping pong
				if(msg == "?"):
					self.sendMessage("!")
				else:
					logging.warning("Unable to decode meta msg %s coming from the client" % msg)
			

	def onOpen(self):
		server_pack = {
			"players": len(self.factory.clients),
			"location": self.factory.game.config['location'],
			"maxPlayers": self.factory.game.config['maxplayers'],
			"map": self.factory.world.map.properties['name']
		}

		self.sendMessage(simplejson.dumps(server_pack, separators=(',', ':')))


	def onWantPlay(self):
		self.interface = Connection(self.factory.world, self.factory.cache)
		self.interface.on('update', self.send_messages)
		self.interface.on('frame', self.send_messages)
		self.interface.on('remove', self.send_messages)
		self.interface.on('meta', self.broadcast_meta_update)
		self.factory.register(self)

		#force initial full update
		self.interface.trigger('step')
	
		#then send all meta, probably should live somewhere else
		for conn in self.factory.clients:
			msg = simplejson.dumps(conn.interface.meta, separators=(',', ':'))
			self.sendMessage(msg)

		#finally send 'weclome msg', at this point game should be playable on the client-side
		welcome_pack = {
			"id": self.interface.archer.id,
			"session_id": self.interface.session_id.hex
		}
		self.sendMessage(simplejson.dumps(welcome_pack, separators=(',', ':')))

	def connectionLost(self, reason):
		WebSocketServerProtocol.connectionLost(self, reason)
		self.factory.unregister(self)

	def onClose(self, wasClean, code, reason):
		if(hasattr(self, 'interface')):
			self.interface.trigger('disconnect')

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

	def broadcast(self, msg, raw=False):
		for c in self.clients:
			c.sendMessage(msg, raw)

	def broadcast_messages(self, messages):
		if(len(messages)):
			self.broadcast(pack_messages(messages), raw=True)

class Archers(object):
	def __init__(self, config):
		self.config = config
	
	def init_networking(self):	
		factory = BroadcastServerFactory("ws://{}:{}".format(self.config['host'], self.config['port']))
		factory.world = self.world
		factory.game = self
		self.world.networking_factory = factory
		factory.cache = MessageCache(self.world)
		factory.protocol = UserCommunication
		listenWS(factory)
		logging.info("Server is listening on %s:%i" % (factory.host, factory.port))

	def init_world(self):	
		if(self.config['map'][-3:] != 'tmx'):
			self.config['map'] = self.config['map'] + ".tmx"
		self.world = World('../resources/{}'.format(self.config['map']))

		logging.info("Initialised map {}".format(self.world.map.properties['name']))
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
	parser = argparse.ArgumentParser(description='Start server for the Archers! game.')
	parser.add_argument('map', type=str,
				   help='Map for this server')
	parser.add_argument('--maxplayers', type=int, default=16,
				   help='Maximum number of players allowed')
	parser.add_argument('--location', type=str, default="Unspecified",
				   help='Location string for the server browser')
	parser.add_argument('--host', type=str, default="localhost",
				   help='Hostname to bind to')
	parser.add_argument('--port', type=int, default=9000,
				   help='Port number to bind to')

	arguments = vars(parser.parse_args())
	Archers(arguments).start()
