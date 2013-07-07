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

		pair = self.is_pair(a, b, 'Arrow', 'Archer')
		if(pair):
			arrow, archer = pair
			# import ipdb; ipdb.set_trace()
			self.world.kill(arrow)
			self.world.kill(archer)
			return

		pair = self.is_pair(a, b, 'Arrow', 'Collidable')
		if(pair):
			arrow, collidable = pair
			self.world.kill(arrow)
			return

	# def PostSolve(self, contact, impulse):
	# 	pass
