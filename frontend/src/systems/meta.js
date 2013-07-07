define(['pc'], function(pc) {
	return pc.systems.EntitySystem.extend('MetaSystem', {}, {
		init:function () {
			this._super([ 'meta' ]);
		},

		process:function (entity) {
			var spatial = entity.getComponent('spatial'),
				meta = entity.getComponent('meta'),
				username = meta.username,
				ctx = pc.device.ctx;

			if(spatial && meta && meta.username) {
				ctx.font = "bold 11px sans-serif"
				ctx.textAlign = 'center'
				if(entity.hasTag('PLAYER')) {
					// ctx.fillStyle = "rgba(10,174,255,1.0)"
					ctx.fillStyle = "rgba(255,255,255,1.0)"
				} else {
					ctx.fillStyle = "rgba(255,157,0,1.0)";
				}
				ctx.fillText(meta.username,
					entity.layer.screenX(spatial.pos.x+0.5*spatial.getDim().x),
					entity.layer.screenY(spatial.pos.y+0.12*spatial.getDim().y)
					);
			}



			// var percWidth = Math.max(healthBar.width * perc, 0);

			// // custom render the health bar
			
			// ctx.globalAlpha = 0.5;
			// if (alpha && alpha.level != 1)
			// 	ctx.globalAlpha = alpha.level;
			// if (ctx.globalAlpha > 0.5)
			// 	ctx.globalAlpha = 0.5;
			// ctx.fillStyle = '#115511';
			// ctx.fillRect(healthBar.offsetX + entity.layer.screenX(),
			// 	healthBar.offsetY + entity.layer.screenY(spatial.pos.y),
			// 	healthBar.width, healthBar.height);
			// if (percWidth)
			// {
			// 	ctx.fillStyle = '#44ff44';
			// 	ctx.fillRect(healthBar.offsetX + entity.layer.screenX(spatial.pos.x),
			// 		healthBar.offsetY + entity.layer.screenY(spatial.pos.y), percWidth, healthBar.height);
			// }
			// ctx.globalAlpha = 1;
		}

	});
});

