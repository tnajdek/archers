define(['pc'], function(pc) {
	return pc.systems.EntitySystem.extend('NetworkSystem', {}, {
		init:function () {
			this._super([ 'network' ]);
		},

		process:function (entity) {
			var spatial = entity.getComponent('spatial'),
				network = entity.getComponent('network'),
				frame;

			if(spatial && network && network.frameStack.length) {
				frame = network.frameStack.pop();
				network.frameStack.length = 0;
				spatial.getPos().x = frame.x-0.5*spatial.getDim().x;
				spatial.getPos().y = frame.y-0.5*spatial.getDim().y;
			}
		}
	});
});

