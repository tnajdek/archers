define(['pc', 'entityfactory'], function(pc, EntityFactory) {
	var GameScene = pc.Scene.extend('pc.archers.GameScene', {}, {
		init:function () {
			this._super();
			this.factory = new EntityFactory();
			this.loadFromTMX(pc.device.loader.get('map').resource, this.factory);
		}
	});
	return GameScene;
});