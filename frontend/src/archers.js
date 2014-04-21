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

			// @TODO: automate or read from items.json
			pc.device.loader.add(new pc.Image('pickup.coin.gold', '/resources/pickup/coin.gold.png'));
			pc.device.loader.add(new pc.Image('pickup.coin.silver', '/resources/pickup/coin.silver.png'));
			pc.device.loader.add(new pc.Image('pickup.coin.copper', '/resources/pickup/coin.copper.png'));
			pc.device.loader.add(new pc.Image('event.deflect', '/resources/event/deflect.png'));
			
			pc.device.loader.add(new pc.Image('base.female.light', '/resources/archer/base.female.light.png'));
			pc.device.loader.add(new pc.Image('base.female.orc', '/resources/archer/base.female.orc.png'));
			pc.device.loader.add(new pc.Image('base.male.light', '/resources/archer/base.male.light.png'));
			pc.device.loader.add(new pc.Image('base.male.orc', '/resources/archer/base.male.orc.png'));
			
			pc.device.loader.add(new pc.Image('base.female.olive', '/resources/archer/base.female.olive.png'));
			pc.device.loader.add(new pc.Image('base.female.dark', '/resources/archer/base.female.dark.png'));
			pc.device.loader.add(new pc.Image('base.male.olive', '/resources/archer/base.male.olive.png'));
			pc.device.loader.add(new pc.Image('base.male.dark', '/resources/archer/base.male.dark.png'));

			pc.device.loader.add(new pc.Image('eqp.arrow', '/resources/archer/eqp.arrow.png'));
			pc.device.loader.add(new pc.Image('eqp.bow', '/resources/archer/eqp.bow.png'));
			pc.device.loader.add(new pc.Image('eqp.female.dress', '/resources/archer/eqp.female.dress.png'));
			pc.device.loader.add(new pc.Image('eqp.greatbow', '/resources/archer/eqp.greatbow.png'));
			pc.device.loader.add(new pc.Image('eqp.male.dagger', '/resources/archer/eqp.male.dagger.png'));
			pc.device.loader.add(new pc.Image('eqp.male.pants.green', '/resources/archer/eqp.male.pants.green.png'));
			pc.device.loader.add(new pc.Image('eqp.male.shirt.white', '/resources/archer/eqp.male.shirt.white.png'));
			pc.device.loader.add(new pc.Image('eqp.recurvebow', '/resources/archer/eqp.recurvebow.png'));

			pc.device.loader.add(new pc.Image('eqp.male.leather.chest', '/resources/archer/eqp.male.leather.chest.png'));
			pc.device.loader.add(new pc.Image('eqp.male.leather.bracers', '/resources/archer/eqp.male.leather.bracers.png'));
			pc.device.loader.add(new pc.Image('eqp.male.leather.shoulders', '/resources/archer/eqp.male.leather.shoulders.png'));
			pc.device.loader.add(new pc.Image('eqp.female.leather.chest', '/resources/archer/eqp.female.leather.chest.png'));
			pc.device.loader.add(new pc.Image('eqp.female.leather.bracers', '/resources/archer/eqp.female.leather.bracers.png'));
			pc.device.loader.add(new pc.Image('eqp.female.leather.shoulders', '/resources/archer/eqp.female.leather.shoulders.png'));
			
			pc.device.loader.add(new pc.Image('eqp.male.green-pants', '/resources/archer/eqp.male.green-pants.png'));
			pc.device.loader.add(new pc.Image('eqp.female.green-pants', '/resources/archer/eqp.female.green-pants.png'));

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

			pc.device.loader.add(new pc.Image('hair.male.long', '/resources/archer/hair.male.long.png'));
			pc.device.loader.add(new pc.Image('hair.male.messy1', '/resources/archer/hair.male.messy1.png'));
			pc.device.loader.add(new pc.Image('hair.male.messy2', '/resources/archer/hair.male.messy2.png'));
			pc.device.loader.add(new pc.Image('hair.male.mohawk', '/resources/archer/hair.male.mohawk.png'));
			pc.device.loader.add(new pc.Image('hair.male.page', '/resources/archer/hair.male.page.png'));
			pc.device.loader.add(new pc.Image('hair.male.parted', '/resources/archer/hair.male.parted.png'));
			pc.device.loader.add(new pc.Image('hair.male.shorthawk', '/resources/archer/hair.male.shorthawk.png'));

			pc.device.loader.add(new pc.Image('eyes.male.blue', '/resources/archer/eyes.male.blue.png'));
			pc.device.loader.add(new pc.Image('eyes.male.brown', '/resources/archer/eyes.male.brown.png'));
			pc.device.loader.add(new pc.Image('eyes.male.gray', '/resources/archer/eyes.male.gray.png'));
			pc.device.loader.add(new pc.Image('eyes.male.green', '/resources/archer/eyes.male.green.png'));
			pc.device.loader.add(new pc.Image('eyes.male.red', '/resources/archer/eyes.male.red.png'));
			pc.device.loader.add(new pc.Image('eyes.female.blue', '/resources/archer/eyes.female.blue.png'));
			pc.device.loader.add(new pc.Image('eyes.female.brown', '/resources/archer/eyes.female.brown.png'));
			pc.device.loader.add(new pc.Image('eyes.female.gray', '/resources/archer/eyes.female.gray.png'));
			pc.device.loader.add(new pc.Image('eyes.female.green', '/resources/archer/eyes.female.green.png'));
			pc.device.loader.add(new pc.Image('eyes.female.red', '/resources/archer/eyes.female.red.png'));

			pc.device.loader.add(new pc.Image('eqp.female.chain.hood', '/resources/archer/eqp.female.chain.hood.png'));
			pc.device.loader.add(new pc.Image('eqp.female.kettle.hat', '/resources/archer/eqp.female.kettle.hat.png'));
			pc.device.loader.add(new pc.Image('eqp.female.leather.cap', '/resources/archer/eqp.female.leather.cap.png'));
			pc.device.loader.add(new pc.Image('eqp.female.leather.hood', '/resources/archer/eqp.female.leather.hood.png'));
			pc.device.loader.add(new pc.Image('eqp.female.plate.helm', '/resources/archer/eqp.female.plate.helm.png'));
			pc.device.loader.add(new pc.Image('eqp.male.chain.hood', '/resources/archer/eqp.male.chain.hood.png'));
			pc.device.loader.add(new pc.Image('eqp.male.kettle.hat', '/resources/archer/eqp.male.kettle.hat.png'));
			pc.device.loader.add(new pc.Image('eqp.male.leather.cap', '/resources/archer/eqp.male.leather.cap.png'));
			pc.device.loader.add(new pc.Image('eqp.male.leather.hood', '/resources/archer/eqp.male.leather.hood.png'));
			pc.device.loader.add(new pc.Image('eqp.male.plate.helm', '/resources/archer/eqp.male.plate.helm.png'));

			pc.device.loader.add(new pc.Image("eqp.female.plate.arms", '/resources/archer/eqp.female.plate.arms.png'));
			pc.device.loader.add(new pc.Image("eqp.female.plate.boots", '/resources/archer/eqp.female.plate.boots.png'));
			pc.device.loader.add(new pc.Image("eqp.female.plate.chest", '/resources/archer/eqp.female.plate.chest.png'));
			pc.device.loader.add(new pc.Image("eqp.female.plate.pants", '/resources/archer/eqp.female.plate.pants.png'));
			pc.device.loader.add(new pc.Image("eqp.male.plate.arms", '/resources/archer/eqp.male.plate.arms.png'));
			pc.device.loader.add(new pc.Image("eqp.male.plate.boots", '/resources/archer/eqp.male.plate.boots.png'));
			pc.device.loader.add(new pc.Image("eqp.male.plate.chest", '/resources/archer/eqp.male.plate.chest.png'));
			pc.device.loader.add(new pc.Image("eqp.male.plate.pants", '/resources/archer/eqp.male.plate.pants.png'));
			pc.device.loader.add(new pc.Image("eqp.female.chain.chest", '/resources/archer/eqp.female.chain.chest.png'));
			pc.device.loader.add(new pc.Image("eqp.male.chain.chest", '/resources/archer/eqp.male.chain.chest.png'));
			pc.device.loader.add(new pc.Image("eqp.female.gold.arms", '/resources/archer/eqp.female.gold.arms.png'));
			pc.device.loader.add(new pc.Image("eqp.female.gold.boots", '/resources/archer/eqp.female.gold.boots.png'));
			pc.device.loader.add(new pc.Image("eqp.female.gold.chest", '/resources/archer/eqp.female.gold.chest.png'));
			pc.device.loader.add(new pc.Image("eqp.female.gold.helm", '/resources/archer/eqp.female.gold.helm.png'));
			pc.device.loader.add(new pc.Image("eqp.female.gold.pants", '/resources/archer/eqp.female.gold.pants.png'));
			pc.device.loader.add(new pc.Image("eqp.male.gold.arms", '/resources/archer/eqp.male.gold.arms.png'));
			pc.device.loader.add(new pc.Image("eqp.male.gold.boots", '/resources/archer/eqp.male.gold.boots.png'));
			pc.device.loader.add(new pc.Image("eqp.male.gold.chest", '/resources/archer/eqp.male.gold.chest.png'));
			pc.device.loader.add(new pc.Image("eqp.male.gold.helm", '/resources/archer/eqp.male.gold.helm.png'));
			pc.device.loader.add(new pc.Image("eqp.male.gold.pants", '/resources/archer/eqp.male.gold.pants.png'));
			pc.device.loader.add(new pc.Image("eqp.female.black.boots", '/resources/archer/eqp.female.black.boots.png'));
			pc.device.loader.add(new pc.Image("eqp.female.brown.boots", '/resources/archer/eqp.female.brown.boots.png'));
			pc.device.loader.add(new pc.Image("eqp.male.black.boots", '/resources/archer/eqp.male.black.boots.png'));
			pc.device.loader.add(new pc.Image("eqp.male.brown.boots", '/resources/archer/eqp.male.brown.boots.png'));

			pc.device.loader.add(new pc.Image("eqp.female.gold.gloves", '/resources/archer/eqp.female.gold.gloves.png'));
			pc.device.loader.add(new pc.Image("eqp.female.plate.gloves", '/resources/archer/eqp.female.plate.gloves.png'));
			pc.device.loader.add(new pc.Image("eqp.male.gold.gloves", '/resources/archer/eqp.male.gold.gloves.png'));
			pc.device.loader.add(new pc.Image("eqp.male.plate.gloves", '/resources/archer/eqp.male.plate.gloves.png'));







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