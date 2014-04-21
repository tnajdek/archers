define([], function() {
	return [
		{
			name: "Local Testing Server",
			url: "http://192.168.2.100:8080",
			socket:"ws://192.168.2.100:9000"
		},
		{
			name: "Some Dead server",
			url: "http://dupakonia",
			socket:"ws://dupakonia.pl:9000"
		},
		{
			name: "Some other server",
			url: "http://localhost:8080",
			socket:"ws://localhost:9000"
		},
	];
});