import pygame
from pygame.locals import *
from archers.utils import rad2vec, vec2rad
from settings import PPM

SCREEN_WIDTH, SCREEN_HEIGHT = 1024, 1024

colors = {
	"fallback": (177, 177, 177, 255),
	"background": (0, 0, 0, 0),
	"collidable": (0, 255, 0, 120),
	"groundcollidable": (0, 0, 255, 120),
	"direction": (255, 157, 0, 255),
	"archer": (255, 255, 255, 255),
}

scale = 0.5
PPM = scale*PPM


class Renderer():

	def __init__(self, world):
		self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT), 0, 32)
		pygame.display.set_caption('Debug renderer')
		self.world = world

	def render_frame(self):
		self.screen.fill(colors['background'])
		for world_object in self.world.object_lookup_by_name.values():
			if(hasattr(world_object, "physics") and hasattr(world_object.physics, 'fixtures')):
				class_ = world_object.__class__.__name__.lower()
				type_ = world_object.type
				name_ = world_object.name
				color = colors.get(class_, colors['fallback'])
				for fixture in world_object.physics.fixtures:
					shape = fixture.shape
					vertices = [(world_object.physics.transform*v)*PPM for v in shape.vertices]
					pygame.draw.polygon(self.screen, color, vertices)

				if(hasattr(world_object, 'direction')):
					pygame.draw.line(
						self.screen,
						colors['direction'],
						world_object.physics.position*PPM,
						(world_object.physics.position + world_object.direction)*PPM
					)
		pygame.display.flip()