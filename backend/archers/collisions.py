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
		a_name = a.get_class_name()
		b_name = b.get_class_name()
		if(a_name == x and b_name == y):
			return (a, b)
		if(a_name == y and b_name == x):
			return (b, a)
		return False

	def PreSolve(self, contact, old_manifold,  *args, **kwargs):
		a = contact.fixtureA.userData
		b = contact.fixtureB.userData

		#dead and unknown players should not collide

		pair = self.is_pair(a, b, 'Arrow', 'Archer')
		if(pair):
			arrow, archer = pair
			if(hasattr(arrow, 'owner') and hasattr(arrow.owner, 'player') and arrow.owner.player and hasattr(archer, 'player') and archer.player):
				# killer and prey both players
				if(archer.is_alive()):
					arrow.owner.player.trigger('kill', archer.player)
					archer.player.trigger('die', killer=arrow.owner.player)
			elif(hasattr(archer, 'player') and archer.player):
				# killer a mob, player died
				if(archer.is_alive()):
					archer.player.trigger('die')

			self.world.kill(arrow)
			self.world.kill(archer)
			return

		pair = self.is_pair(a, b, 'Arrow', 'Skeleton')
		if(pair):
			arrow, skeleton = pair
			if(hasattr(arrow, 'owner') and hasattr(arrow.owner, 'player') and arrow.owner.player):
				if(skeleton.is_alive()):
					arrow.owner.player.trigger('mob')
			self.world.kill(arrow)
			self.world.kill(skeleton)


		pair = self.is_pair(a, b, 'Arrow', 'Collidable')
		if(pair):
			arrow, collidable = pair
			self.world.kill(arrow)
			return

	# def PostSolve(self, contact, impulse):
	# 	pass
