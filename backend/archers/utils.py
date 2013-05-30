from math import atan2, cos, sin
from Box2D import b2Vec2


def rad2vec(radians, m=1):
    return b2Vec2(cos(radians), sin(radians)) * m


def vec2rad(vector):
    return atan2(vector.y, vector.x)
