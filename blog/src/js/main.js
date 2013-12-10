(function () {
	var $ = document.querySelector.bind(document),
		$menuButton = $('button.menu'),
		$closeButton = $('button.close'),
		$nav = $('nav.post-menu');

	$menuButton.addEventListener('click', function() {
		$nav.classList.toggle('show');
	});

	$closeButton.addEventListener('click', function() {
		$nav.classList.remove('show');
	});

})();