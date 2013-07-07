define(['lodash', 'spritedef/archer'], function(_, archer) {
	var skeleton = _.clone(archer);
	skeleton.spriteName = 'skeleton';
	return skeleton;
});