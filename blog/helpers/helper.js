module.exports.register = function (Handlebars, options) {
	var grunt = require('grunt'),
			_ = require('lodash');

	Handlebars.registerHelper('nextArticle', function (pages, cur, options) {
		var i,sorted, curPage, curIndex, nextIndex;

		sorted = _.sortBy(pages, function(item) {
			return item.data.date;
		});

		curPage = _.find(sorted, function(item) {
			return item.data.title == cur.title;
		});

		curIndex = _.indexOf(sorted, curPage);
		nextIndex = curIndex + 1;

		if(sorted[nextIndex]) {
			return options.fn(sorted[nextIndex]);
		}
	});

	Handlebars.registerHelper('getPosts', function(src, options) {
		var yfm = require('assemble-yaml'),
			glob = require('globule').
			files, data;

		options = options || {
			fromFile: true
		};

		grunt.log.writeln(glob);
		grunt.log.writeln('meh---------------');

		files = glob.find(src);

		data = files.map(function (path) {
			return yfm.extract(path, options).context;
		});

		data = _.sortBy(data, function(item) {
			return item.date;
		});

		return data.map(function (obj) {
			return options.fn(obj);
		}).join('');
	});
};
