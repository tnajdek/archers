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

archers = Archers()
reactor.callLater(0.1, spawn_player)
reactor.callLater(0.2, move_player, 'east')
reactor.callLater(0.6, stop_player)
reactor.callLater(0.7, move_player, 'south')
reactor.callLater(0.9, move_player, 'east')
reactor.callLater(2.0, move_player, 'south')
reactor.callLater(2.3, move_player, 'east')
reactor.callLater(3, stop_player)
reactor.callLater(3.1, attack, 'west')
archers.start()


