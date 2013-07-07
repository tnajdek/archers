define(['pc'], function(pc) {
	return pc.components.Component('Meta', {
		create: function () {
			var n = this._super();
			n.config();
			return n;
		}
	}, {
		username: "",

		init: function () {
			this._super(this.Class.shortName);
			this.config();
		},

		update: function(meta) {
			if(meta['username']) {
				this.username = meta['username'];
			}
		},

		config: function() {}

	});
});