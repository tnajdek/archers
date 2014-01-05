import simplejson as json
import logging
from archers.config import items_file_path

with open(items_file_path, 'r') as f:
	filedata = f.read()

data = json.loads(filedata)
items = data['items']
slots = data['slots']


def get_slot_for(string_repr):
	for key, value in slots.iteritems():
		if(value['name'] == string_repr):
			return key
	return None

def verify_slots(slots, budget):
	cost = 0
	for slot, itemid in slots.iteritems():
		if(itemid):
			#itemid might be a list [itemid, variant] or just string itemid
			try:
				assert not isinstance(itemid, str)
				itemid = itemid[0]
			except AssertionError:
				pass 

			item = data['items'][itemid]
			if(item['slot'] != int(slot)):
				logging.info("Slots %s are invalid item in slot %s" % (slots, slot))
				return False
			if('price' in item):
				cost = cost + item['price']
	
	if(cost > budget):
		logging.info("Slots %s are invalid, price %i exceeds %i budget" % (slots, cost, budget))
		return False

	return True