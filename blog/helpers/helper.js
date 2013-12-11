module.exports.register = function (Handlebars, options) {
	Handlebars.registerHelper('nextArticle', function (pages, cur, options) {
		var grunt = require('grunt'),
			_ = require('lodash'),
			i,sorted, curPage, curIndex, nextIndex;

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
};