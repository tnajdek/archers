from archers.world import MapObject, NetworkMixin, Collidable
from archers.collisions import CLCAT_TERRESTRIAL_OBSTACLE

PICKUP_BONUS_COIN = 1;


class Pickup(Collidable, NetworkMixin):
	default_type =  "pickup"
	collision_category = CLCAT_TERRESTRIAL_OBSTACLE
	"""docstring for Pickup"""
	def __init__(self, world, data, **kwargs):
		self.x = data.x
		self.y = data.y
		self.state = 'standing'
		super(Pickup, self).__init__(world, data, **kwargs)


class CopperCoin(Pickup):
	def __init__(self, world, data):
		super(CopperCoin, self).__init__(world, data)
		self.bonus = PICKUP_BONUS_COIN
		self.value = 1

class SilverCoin(Pickup):
	def __init__(self, world, data):
		super(SilverCoin, self).__init__(world, data)
		self.bonus = PICKUP_BONUS_COIN
		self.value = 5

class GoldCoin(Pickup):
	def __init__(self, world, data):
		super(GoldCoin, self).__init__(world, data)
		self.bonus = PICKUP_BONUS_COIN
		self.value = 10