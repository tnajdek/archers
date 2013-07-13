define(['pc'], function(pc) {
	return pc.components.Component('Network', {
		create: function () {
			var n = this._super();
			n.config();
			return n;
		}
	}, {
		frameStack: [],

		init: function () {
			this._super(this.Class.shortName);
			this.config();
		},

		update: function(frame) {
			this.frameStack.push(frame)
			// spatial.getPos().x = msg.x-0.5*spatial.getDim().x;
			// spatial.getPos().y = msg.y-0.5*spatial.getDim().y;
		},

		config: function() {}

	});
});