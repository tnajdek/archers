import pygame
from pygame.locals import *

PPM = 32.0
TARGET_FPS = 60
TIME_STEP = 1.0/TARGET_FPS
SCREEN_WIDTH, SCREEN_HEIGHT = 640, 480
# clock = pygame.time.Clock()

class Renderer():

	def __init__(self, world):
		self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT), 0, 32)
		pygame.display.set_caption('Debug renderer')
		self.world = world.physics

	def render_frame(self):
		self.screen.fill((0,0,0,0))
		for body in self.world.bodies:
			for fixture in body.fixtures:
				shape = fixture.shape
				vertices = [(body.transform*v)*PPM for v in shape.vertices]
				vertices = [(v[0], SCREEN_HEIGHT-v[1]) for v in vertices]
				pygame.draw.polygon(self.screen, (255,255,255,255), vertices)
		pygame.display.flip()
		# print clock.tick()