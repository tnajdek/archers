define(['pc'], function(pc) {
	return pc.systems.Render.extend("RenderSystem", {}, {
		processAll: function() {
			var next = this.entities.first,
				entity;
			this._super();

			while (next) {
				entity = next.object();
				this.process(entity);
				next = next.next();
			}
		},

		process:function (entity) {
			var spatial = entity.getComponent('spatial'),
				state = entity.getComponent('state'),
				meta = entity.getComponent('meta'),
				ctx = pc.device.ctx;

			if(spatial && state && state.state != 'unknown' && meta && meta.username) {

				ctx.font = "11px ponderosa,monospace";
				ctx.textAlign = 'center';
				if(entity.hasTag('PLAYER')) {
					// ctx.fillStyle = "rgba(10,174,255,1.0)"
					ctx.fillStyle = "rgba(255,157,0,1.0)";
				} else {
					ctx.fillStyle = "rgba(235,235,235,1.0)";
				}
				ctx.fillText(meta.username,
					entity.layer.screenX(spatial.pos.x+0.5*spatial.getDim().x),
					entity.layer.screenY(spatial.pos.y+0.12*spatial.getDim().y)
					);
			}

			this._super();
		}
	});
});