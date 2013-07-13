define(['jquery', 'pc', 'networking', 'scenes/game', 'lobbymanager'],
	function($, pc, Networking, GameScene, lobbyManager) {
	var Archers = pc.Game.extend('Archers', {
	// statics
	}, {
		onReady: function () {
			this._super();
			lobbyManager.init();

			pc.device.loader.add(new pc.DataResource(
				'map',
				'/resources/map.tmx'
			));

			pc.device.loader.add(new pc.Image(
				'combined',
				'/resources/tiles.png'
			));

			pc.device.loader.add(new pc.Image(
				'archer',
				'/resources/archer.png'
			));

			pc.device.loader.add(new pc.Image(
				'arrow',
				'/resources/arrow.png'
			));

			pc.device.loader.add(new pc.Image(
				'skeleton',
				'/resources/skeleton.png'
			));

			pc.device.loader.start(this.onLoading.bind(this), this.onLoaded.bind(this));
		},

		onLoading:function (percentageComplete) {
			var ctx = pc.device.ctx;
			$('#init').hide();
			ctx.clearRect(0,0,pc.device.canvasWidth, pc.device.canvasHeight);
			ctx.font = "normal 50px ArchitectsDaughter";
			// ctx.fillStyle = "#8A0707";
			ctx.fillStyle = "#006b6d";
			ctx.fillText('Archers!', 40, (pc.device.canvasHeight / 2)-50);
			ctx.font = "normal 14px ponderosa";
			ctx.fillStyle = "#fefefe";
			ctx.fillText('Loading Game Assets:  ' + percentageComplete + '%', 40, pc.device.canvasHeight/2);
		},

		onLoaded:function () {
			// create the game scene (notice we do it here AFTER the resources are loaded)
			this.gameScene = new GameScene();
			this.addScene(this.gameScene);



			// // create the menu scene (but don't make it active)
			// this.menuScene = new MenuScene();
			// this.addScene(this.menuScene, false);

			// // resources are all ready, start the main game scene
			// // (or a menu if you have one of those)
			this.activateScene(this.gameScene);
			this.networking = new Networking();
		},
	});
	return Archers;
});