from twisted.protocols import basic
import simplejson
# from os import linesep
from pprint import pformat
import sys
from guppy import hpy
import gc


class TablePrinter(object):
	"Print a list of dicts as a table"
	def __init__(self, fmt, sep='\t', ul="="):
		"""
		@param fmt: list of tuple(heading, key, width)
						heading: str, column label
						key: dictionary key to value to print
						width: int, column width in chars
		@param sep: string, separation between columns
		@param ul: string, character to underline column label, or None for no underlining
		"""
		super(TablePrinter,self).__init__()
		self.fmt   = str(sep).join('{lb}{0}:{1}{rb}'.format(key, width, lb='{', rb='}') for heading,key,width in fmt)
		self.head  = {key:heading for heading,key,width in fmt}
		self.ul    = {key:str(ul)*width for heading,key,width in fmt} if ul else None
		self.width = {key:width for heading,key,width in fmt}

	def row(self, data):
		return self.fmt.format(**{ k:str(data.get(k,''))[:w] for k,w in self.width.iteritems() })

	def __call__(self, dataList):
		_r = self.row
		res = [_r(data) for data in dataList]
		res.insert(0, _r(self.head))
		if self.ul:
			res.insert(1, _r(self.ul))
		return '\n'.join(res)


class CmdInterface(basic.LineReceiver):
	from os import linesep as delimiter

	def __init__(self, world):
		self.world = world

	def write(self, msg):
		self.out(msg)

	def out(self, msg):
		if(not isinstance(msg, basestring)):
			try:
				msg = simplejson.dumps(msg)
			except TypeError:
				msg = pformat(msg)

		self.transport.write(msg)
		self.transport.write(CmdInterface.delimiter)
		self.prompt()

	def prompt(self):
		self.transport.write('>>> ')

	def connectionMade(self):
		self.prompt()

	def c(self, *args):
		return self.connections(*args)

	def connections(self, *args):
		gc.collect()
		from archers.interface import Connection
		connections = dict()
		for obj in gc.get_objects():
			if isinstance(obj, Connection):
				connections[obj] = gc.get_referrers(obj)

		self.out("Game currently has %i connections held open:" % len(connections))
		for conn in connections:
			referrers = connections[conn]
			self.out("%s with %i referrers" % (conn.session_id, len(referrers)))
			for referrer in referrers:
				self.out("\t\t %s" % referrer.__class__.__name__)
				# self.out(str(referrer))

	def m(self, *args):
		return self.memory()

	def mem(self, *args):
		return self.memory()

	def memory(self, *args):
		h = hpy()
		self.out(h.heap())

	def e(self, *args):
		return self.entity(*args)

	def entity(self, *args):
		try:
			what = args[0]
		except IndexError:
			what = "help"

		try:
			entity_id = args[1]
		except IndexError:
			entity_id = None

		def get_entity(args):
			try:
				return self.world.object_index[int(args)]
			except IndexError:
				self.out("Need entity id to kill")
			except KeyError:
				self.out("Invalid entitiy id: %s" % args)
			return None

		if(what == 'show'):
			e = get_entity(entity_id)
			if(e):
				self.out(e)
		elif(what == 'kill'):
			e = get_entity(entity_id)
			if(e):
				self.world.kill(e)
				self.out("Done")
		elif(what == 'list'):
			ents = list()
			fmt = [('id', 'id', 5), ('class', 'class', 20), ('type', 'type', 20), ('player', 'player', 20), ('grpindex', 'grpindex', 5)]
			self.out("World currently holds %i entities:" % len(self.world.object_index))
			for eid in self.world.object_index:
				e = self.world.object_index[eid]
				ent = dict()
				ent['id'] = e.id
				ent['class'] = e.__class__.__name__
				ent['type'] = e.type or "not set"
				ent['player'] = ''
				ent['grpindex'] = ''
				if(hasattr(e, 'player') and e.player):
					ent['player'] = e.player.meta['username']
				if(hasattr(e, 'group_index')):
					ent['grpindex'] = e.group_index
				ents.append(ent)
			self.out(TablePrinter(fmt)(ents))
		else:
			self.out("Valid options: list, kill, show")

	def help(self, *args):
		self.out("Options are: (e)ntities [list|show|kill], (m)emory, (c)onnections")

	def lineReceived(self, line):
		arguments = line.split()
		# try:
		command = arguments.pop(0)
		if(hasattr(self, command) and callable(getattr(self, command))):
			getattr(self, command)(*arguments)
		else:
			self.out("Command not found: %s" % command)
		# except IndexError:
		# 	self.out("")
		# except TypeError:
		# 	self.out("Invalid arguments for command %s" % command)
		# except Exception:
		# 	self.out("Unable to process command %s" % line)
