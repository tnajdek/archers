from twisted.internet import reactor, task
from autobahn.websocket import listenWS
from autobahn.wamp import WampServerFactory, WampServerProtocol, exportRpc
import sys

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


class Archers():
	def startNetworking(self):
		factory = WampServerFactory("ws://localhost:9000")
		factory.protocol = UserActionsHandler
		listenWS(factory)

	def startCore(self):
		task.LoopingCall(sys.stderr.write, '.').start(.4)
		reactor.run()

	def start(self):
		self.startCore()
		self.startNetworking()



if __name__ == '__main__':
	archers = Archers()
	Archers.start()
	
