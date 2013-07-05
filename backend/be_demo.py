#!/usr/bin/env python2
from game import Archers
from archers.archer import Archer
from twisted.internet import reactor
from archers.world import directions

archer = None


def spawn_archer():
	global archer
	world = archers.world
	spawn_point = world.get_spawn_points()[0]
	archer = Archer(world)
	archer.spawn(spawn_point)
	import ipdb; ipdb.set_trace()


def move_archer(direction):
	global archer
	archer.want_move(directions[direction])

def stop_archer():
	global archer
	archer.want_stop()

def attack(direction):
	global archer
	archer.want_attack(directions[direction])

def spawn_sucker():
	world = archers.world
	spawn_point = world.get_spawn_points()[2]
	sucker = Archer(world)
	sucker.spawn(spawn_point)

delay = 0
archers = Archers()
reactor.callLater(delay+0.1, spawn_archer)
reactor.callLater(delay+0.1, spawn_sucker)
reactor.callLater(delay+0.2, move_archer, 'east')
reactor.callLater(delay+0.6, stop_archer)
reactor.callLater(delay+0.7, move_archer, 'south')
reactor.callLater(delay+0.9, move_archer, 'east')
reactor.callLater(delay+2.0, move_archer, 'south')
reactor.callLater(delay+2.3, move_archer, 'east')
reactor.callLater(delay+3, stop_archer)
reactor.callLater(delay+3.1, attack, 'west')
reactor.callLater(delay+4.0, move_archer, 'south')
reactor.callLater(delay+4.2, stop_archer)
reactor.callLater(delay+4.3, attack, 'west')
reactor.callLater(delay+5.0, move_archer, 'south')
reactor.callLater(delay+5.8, stop_archer)
reactor.callLater(delay+6.5, attack, 'west')
reactor.callLater(delay+7.5, attack, 'north')
reactor.callLater(delay+8.5, attack, 'east')
reactor.callLater(delay+9.5, attack, 'south')
archers.start()


