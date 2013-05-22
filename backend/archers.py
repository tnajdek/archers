from twisted.internet import reactor
from autobahn.websocket import listenWS
from autobahn.wamp import WampServerFactory, WampServerProtocol, exportRpc


DOMAIN = 'http://localhost/'


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
		self.registerForRpc(self, "%s%s#" % (DOMAIN, 'rpc'))
		self.registerForPubSub("%s%s#" % (DOMAIN, 'pubsub'))

if __name__ == '__main__':
	factory = WampServerFactory("ws://localhost:9000")
	factory.protocol = UserActionsHandler
	listenWS(factory)
	reactor.run()
