define(function() {
	var Message = {
		format: {
			'b': Int8Array,
			'B': Uint8Array,
			'?': Uint8Array,
			'h': Int16Array,
			'H': Uint16Array,
			'i': Int32Array,
			'I': Uint32Array,
			'f': Float32Array,
			'd': Float64Array
		},

		// schema.item = ['id', 'x', 'y', 'direction', 'state']
		// schema.itemFormat = 'IffBB'

		extractValue: function(typedArray, schemaType) {
			var value = typedArray[0];
			if(schemaType === '?') {
				value = !!value;
			}
			return value;
		},

		fromBuffer: function(buffer) {
			var pointer = 0,
				bytePointer = 0,
				itemBuffer, schemaType,	type, typedArray, key, value;
			while(pointer < this.schema.itemFormat.length) {
				schemaType = this.schema.itemFormat.charAt(pointer);
				type = this.format[schemaType];
				typedArray = new type(buffer, bytePointer, 1);
				value = this.extractValue(typedArray[0], schemaType);
				key = this.schema.item[pointer];
				this[key] = value;

				bytePointer += type.BYTES_PER_ELEMENT;
				pointer++;
			}
		}
	};
	return Message;
});
