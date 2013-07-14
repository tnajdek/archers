define(['lodash', 'pc'], function(_, pc) {
	return pc.systems.EntitySystem.extend('NetworkSystem', {}, {
		init:function () {
			this._super([ 'network' ]);
			this.frameInterval = ~~(1.0/30*1000);
		},

		interpolate: function(network, spatial) {
			var timeSinceLastFrameApplied = pc.device.now - network.lastFrameAppliedTime,
				percentInterpolate = timeSinceLastFrameApplied/this.frameInterval,
				lastFrame = network.lastFrameApplied,
				targetFrame = network.frameStack[0],
				diffX, diffY;

			if(percentInterpolate>1) {
				percentInterpolate = 1;
			}

			diffX = percentInterpolate*(targetFrame.x - lastFrame.x);
			diffY = percentInterpolate*(targetFrame.y - lastFrame.y);

			if(lastFrame.x == 0 && lastFrame.y == 0) {
				// x,y = 0,0 has special meaning, no interpolation
				return
			}

			spatial.getPos().x = (lastFrame.x+diffX)-0.5*spatial.getDim().x;
			spatial.getPos().y = (lastFrame.y+diffY)-0.5*spatial.getDim().y;
		},

		process:function (entity) {
			var spatial = entity.getComponent('spatial'),
				network = entity.getComponent('network'),
				frame;

			if(spatial && network && network.frameStack.length > 1) {
				// buffer overflown

				// [olderst, old, current, future]
				network.frameStack.reverse(); // [future, current, old, oldest]
				network.frameStack.length = 2; // [future, current]
				frame = network.frameStack.pop(); // frame = current; [ future ]
				spatial.getPos().x = frame.x-0.5*spatial.getDim().x;
				spatial.getPos().y = frame.y-0.5*spatial.getDim().y;
				network.lastFrameApplied = frame;
				network.lastFrameAppliedTime = pc.device.now;
			} else if (spatial && network && network.frameStack.length == 1 && network.lastFrameApplied) {
				// if(entity.hasTag('PLAYER')) {
				this.interpolate(network, spatial);
				// }
			}
		}
	});
});

