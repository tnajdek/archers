#!/usr/bin/env python2
from game import Archers
from archers.archer import Archer
from twisted.internet import reactor
from archers.world import directions
from random import shuffle, randrange


archer_entities = list()
dir_values = directions.values()


def spawn_archer():
	# global archers
	world = archers.world
	sp = world.get_spawn_points()
	shuffle(sp)
	spawn_point = sp[0]
	archer = Archer(world)
	archer.spawn(spawn_point)
	archer_entities.append(archer)


def do_something():
	# global archers
	if(len(archer_entities)):
		shuffle(archer_entities)
		shuffle(dir_values)
		archer = archer_entities[0]
		if(archer.state != 'shooting'):
			if(archer.physics.position.x > 63):
				archer.want_move(directions['west'])
			elif(archer.physics.position.x < 0):
				archer.want_move(directions['east'])
			elif(archer.physics.position.y > 63):
				archer.want_move(directions['north'])
			elif(archer.physics.position.y < 0):
				archer.want_move(directions['south'])
			else:
				random = randrange(100)
				if(random < 30):
					archer.want_stop()
				elif(random < 95):
					archer.want_move(dir_values[0])
				elif(random < 99):
					archer.want_attack(dir_values[0])
				elif(len(archer_entities) < 5):
					spawn_archer()

		if(archer.state == 'dead'):
			archer = archer_entities.pop(archer_entities.index(archer))
			archer.destroy()
	else:
		spawn_archer()

	reactor.callLater(0.1, do_something)

delay = 0
archers = Archers()
reactor.callLater(delay+0.1, spawn_archer)
reactor.callLater(delay+0.2, do_something)
archers.start()


