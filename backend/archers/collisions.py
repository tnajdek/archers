import logging
import random
from utils import get_class

from Box2D import b2ContactListener


CLCAT_OBSTACLE = 0x0002
CLCAT_TERRESTRIAL_OBSTACLE = 0x0004
CLCAT_AIRBORNE_OBSTACLE = 0x0008
CLCAT_CREATURE = 0x0010
CLCAT_BULLET = 0x0020

CLCAT_NOTHING = 0x0000
CLCAT_EVERYTHING = 0xFFFF


#  very lame for the time being
# and it's not the right place for it
class Collisions(b2ContactListener):
	def __init__(self, world):
		b2ContactListener.__init__(self)
		self.world = world

	# def BeginContact(self, contact):
	# 	pass

	# def EndContact(self, contact):
	# 	pass

	def is_pair(self, a, b, x, y):
		x = get_class(x)
		y = get_class(y)

		if(isinstance(a, x) and isinstance(b, y)):
			return(a, b)
		if(isinstance(a, y) and isinstance(b, x)):
			return(b, a)

		return False

	def PreSolve(self, contact, old_manifold,  *args, **kwargs):
		a = contact.fixtureA.userData
		b = contact.fixtureB.userData

		#dead and unknown players should not collide

		pair = self.is_pair(a, b, 'archers.archer.Arrow', 'archers.archer.Archer')
		if(pair):
			arrow, archer = pair
			if(hasattr(arrow, 'owner') and hasattr(arrow.owner, 'player') and arrow.owner.player and hasattr(archer, 'player') and archer.player):
				# killer and prey both players
				if(archer.is_alive()):
					arrow.owner.player.trigger('kill', archer.player)
					archer.player.trigger('die', killer=arrow.owner.player)
					logging.debug("Arrow of {} hits {}".format(arrow.owner, archer))
			elif(hasattr(archer, 'player') and archer.player):
				# killer a mob, player died
				if(archer.is_alive()):
					archer.player.trigger('die')
					logging.debug("Arrow of a mob hits {}".format(archer))

			defense = archer.attributes['defense']
			chance = random.random()

			logging.debug("Fired with {} chance, got defense {}".format(chance, defense))
			if(defense > 0 and chance < defense):
				#miss!
				#todo: fire some visual event
				logging.debug("Defense!")
				self.world.kill(arrow)
			else:
				self.world.kill(arrow)
				self.world.kill(archer)
			return

		pair = self.is_pair(a, b, 'archers.archer.Arrow', 'archers.archer.Skeleton')
		if(pair):
			arrow, skeleton = pair
			if(hasattr(arrow, 'owner') and hasattr(arrow.owner, 'player') and arrow.owner.player):
				if(skeleton.is_alive()):
					arrow.owner.player.trigger('mob')
			self.world.kill(arrow)
			self.world.kill(skeleton)
			return

		pair = self.is_pair(a, b, 'archers.archer.Archer', 'archers.pickups.Pickup')
		if(pair):
			archer, pickup = pair
			if(hasattr(archer, 'player') and archer.player):
				archer.player.trigger('pickup', pickup)
				logging.debug("{} picked up {}".format(archer, pickup))
			self.world.kill(pickup)
			return


		pair = self.is_pair(a, b, 'archers.archer.Arrow', 'archers.world.Collidable')
		if(pair):
			arrow, collidable = pair
			self.world.kill(arrow)
			return

		pair = self.is_pair(a, b, 'archers.archer.Archer', 'archers.archer.Archer')
		if(pair):
			archer1, archer2 = pair
			archer1.bump_into(archer2)
			archer2.bump_into(archer1)
			logging.debug("{} bumped into {}".format(archer1, archer2))
			return

		

	# def PostSolve(self, contact, impulse):
	# 	pass
