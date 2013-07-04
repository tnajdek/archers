#!/usr/bin/env python2
from game import Archers
from archers.player import Player
from twisted.internet import reactor
from archers.world import directions
from random import shuffle, randrange


players = list()
dir_values = directions.values()

def spawn_player():
	# global players
	world = archers.world
	sp = world.get_spawn_points()
	shuffle(sp)
	spawn_point = sp[0]
	player = Player(world)
	player.spawn(spawn_point)
	players.append(player)

def do_something():
	# global players
	shuffle(players)
	shuffle(dir_values)
	player = players[0]
	if(player.state != 'shooting'):
		if(player.physics.position.x > 32):
			player.want_move(directions['west'])
		elif(player.physics.position.x < 0):
			player.want_move(directions['east'])
		elif(player.physics.position.y > 24):
			player.want_move(directions['north'])
		elif(player.physics.position.y < 0):
			player.want_move(directions['south'])
		else:
			random = randrange(100)
			if(random < 30):
				player.want_stop()
			elif(random < 80):
				player.want_move(dir_values[0])
			elif(random < 99):
				player.want_attack(dir_values[0])
			else:
				spawn_player()
	reactor.callLater(0.1, do_something)

delay = 0
archers = Archers()
reactor.callLater(delay+0.1, spawn_player)
reactor.callLater(delay+0.2, do_something)
archers.start()


