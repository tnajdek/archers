from math import atan2, cos, sin
from Box2D import b2Vec2


def rad2vec(radians, m=1):
	return b2Vec2(cos(radians), sin(radians)) * m


def vec2rad(vector):
	return atan2(vector.y, vector.x)


class EventsMixins(object):
	_callbacks = dict()

	def on(self, event, callback, context=None):
		if not (event in self._callbacks):
			self._callbacks[event] = list()
		self._callbacks[event].append([callback, context])

	def off(self, event):
		del self._callbacks[event]

	def trigger(self, event, *args, **kwargs):
		try:
			callbacks = self._callbacks[event]
		except KeyError:
			return

		for callback in callbacks:
			if(callback[1]):
				kwargs['_context'] = self._callbacks[event][1]
			callback[0](*args, **kwargs)
