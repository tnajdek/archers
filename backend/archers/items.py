import simplejson as json
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