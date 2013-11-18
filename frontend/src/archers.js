define(['jquery', 'vent', 'pc', 'networking', 'scenes/game', 'scenes/customize', 'lobbymanager', 'customizer'],
	function($, vent, pc, Networking, GameScene, CustomizeScene, lobbyManager, customizer) {
	var Archers = pc.Game.extend('Archers', {
	// statics
	}, {
		onReady: function () {
			this._super();

			pc.device.loader.add(new pc.DataResource(
				'items',
				'/resources/items.json'
			));

			pc.device.loader.add(new pc.DataResource(
				'map',
				'/resources/map.tmx'
			));

			pc.device.loader.add(new pc.DataResource(
				'customizer',
				'/resources/customizer.tmx'
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

			pc.device.loader.add(new pc.Image('base.female.light', '/resources/archer/base.female.light.png'));
			pc.device.loader.add(new pc.Image('base.female.orc', '/resources/archer/base.female.orc.png'));
			pc.device.loader.add(new pc.Image('base.male.light', '/resources/archer/base.male.light.png'));
			pc.device.loader.add(new pc.Image('base.male.orc', '/resources/archer/base.male.orc.png'));
			pc.device.loader.add(new pc.Image('eqp.arrow', '/resources/archer/eqp.arrow.png'));
			pc.device.loader.add(new pc.Image('eqp.bow', '/resources/archer/eqp.bow.png'));
			pc.device.loader.add(new pc.Image('eqp.female.dress', '/resources/archer/eqp.female.dress.png'));
			pc.device.loader.add(new pc.Image('eqp.greatbow', '/resources/archer/eqp.greatbow.png'));
			pc.device.loader.add(new pc.Image('eqp.male.dagger', '/resources/archer/eqp.male.dagger.png'));
			pc.device.loader.add(new pc.Image('eqp.male.pants.green', '/resources/archer/eqp.male.pants.green.png'));
			pc.device.loader.add(new pc.Image('eqp.male.shirt.white', '/resources/archer/eqp.male.shirt.white.png'));
			pc.device.loader.add(new pc.Image('eqp.recurvebow', '/resources/archer/eqp.recurvebow.png'));

			// hair
			pc.device.loader.add(new pc.Image('hair.female.bangsshort', '/resources/archer/hair.female.bangsshort.png'));
			pc.device.loader.add(new pc.Image('hair.female.loose', '/resources/archer/hair.female.loose.png'));
			pc.device.loader.add(new pc.Image('hair.female.pixie', '/resources/archer/hair.female.pixie.png'));
			pc.device.loader.add(new pc.Image('hair.female.ponytail', '/resources/archer/hair.female.ponytail.png'));
			pc.device.loader.add(new pc.Image('hair.female.princess', '/resources/archer/hair.female.princess.png'));
			pc.device.loader.add(new pc.Image('hair.female.swoop', '/resources/archer/hair.female.swoop.png'));
			pc.device.loader.add(new pc.Image('hair.female.unkempt', '/resources/archer/hair.female.unkempt.png'));
			pc.device.loader.add(new pc.Image('hair.male.bangs', '/resources/archer/hair.male.bangs.png'));
			pc.device.loader.add(new pc.Image('hair.male.bedhead', '/resources/archer/hair.male.bedhead.png'));
			pc.device.loader.add(new pc.Image('hair.male.longhawk', '/resources/archer/hair.male.longhawk.png'));
			pc.device.loader.add(new pc.Image('hair.male.long', '/resources/archer/hair.male.long.png'));
			pc.device.loader.add(new pc.Image('hair.male.messy1', '/resources/archer/hair.male.messy1.png'));
			pc.device.loader.add(new pc.Image('hair.male.messy2', '/resources/archer/hair.male.messy2.png'));
			pc.device.loader.add(new pc.Image('hair.male.mohawk', '/resources/archer/hair.male.mohawk.png'));
			pc.device.loader.add(new pc.Image('hair.male.page', '/resources/archer/hair.male.page.png'));
			pc.device.loader.add(new pc.Image('hair.male.parted', '/resources/archer/hair.male.parted.png'));
			pc.device.loader.add(new pc.Image('hair.male.shorthawk', '/resources/archer/hair.male.shorthawk.png'));

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
			var that = this;

			// parse JSON
			pc.device.loader.get('items').resource.data = JSON.parse(pc.device.loader.get('items').resource.data);

			lobbyManager.init();
			customizer.init();

			// create the game scene (notice we do it here AFTER the resources are loaded)
			this.gameScene = new GameScene();
			this.customizeScene = new CustomizeScene();

			this.addScene(this.customizeScene, false);
			this.addScene(this.gameScene, true);

			vent.on('customize', function() {
				that.deactivateScene(that.gameScene);
				that.activateScene(that.customizeScene);
			});

			vent.on('customize:end', function() {
				that.deactivateScene(that.customizeScene);
				that.activateScene(that.gameScene);
			});

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