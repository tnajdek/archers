(function () {
	var $ = document.querySelector.bind(document),
		$menuButton = $('button'),
		$nav = $('nav');

	$menuButton.addEventListener('click', function() {
		$nav.classList.toggle('show');
	});

})();