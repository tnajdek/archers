define(function() {
	return {
		spriteName: "arrow",
		frameDefault:"shooting S",
		frameWidth: 32,
		frameHeight: 32,
		frames: [
			{"name":"shooting N","frameX":1,"frameY":0,"frameCount":1,"time":900},
			{"name":"shooting W","frameX":3,"frameY":0,"frameCount":1,"time":900},
			{"name":"shooting S","frameX":2,"frameY":0,"frameCount":1,"time":900},
			{"name":"shooting E","frameX":0,"frameY":0,"frameCount":1,"time":900}
		]
	};
});