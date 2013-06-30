#!/usr/bin/env python2
from game import Archers
from archers.player import Player
from twisted.internet import reactor
from archers.world import directions

player = None


def spawn_player():
	global player
	world = archers.world
	spawn_point = world.get_spawn_points()[0]
	player = Player(world)
	player.spawn(spawn_point)


def move_player(direction):
	global player
	player.want_move(directions[direction])

def stop_player():
	global player
	player.want_stop()

def attack(direction):
	global player
	player.want_attack(directions[direction])

def spawn_sucker():
	world = archers.world
	spawn_point = world.get_spawn_points()[2]
	sucker = Player(world)
	sucker.spawn(spawn_point)

delay = 5
archers = Archers()
reactor.callLater(delay+0.1, spawn_player)
reactor.callLater(delay+0.1, spawn_sucker)
reactor.callLater(delay+0.2, move_player, 'east')
reactor.callLater(delay+0.6, stop_player)
reactor.callLater(delay+0.7, move_player, 'south')
reactor.callLater(delay+0.9, move_player, 'east')
reactor.callLater(delay+2.0, move_player, 'south')
reactor.callLater(delay+2.3, move_player, 'east')
reactor.callLater(delay+3, stop_player)
reactor.callLater(delay+3.1, attack, 'west')
reactor.callLater(delay+4.0, move_player, 'south')
reactor.callLater(delay+4.2, stop_player)
reactor.callLater(delay+4.3, attack, 'west')
reactor.callLater(delay+5.0, move_player, 'south')
reactor.callLater(delay+5.8, stop_player)
reactor.callLater(delay+6.5, attack, 'west')
reactor.callLater(delay+7.5, attack, 'north')
reactor.callLater(delay+8.5, attack, 'east')
reactor.callLater(delay+9.5, attack, 'south')
archers.start()


