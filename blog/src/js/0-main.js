(function () {
	var $ = document.querySelector.bind(document),
		$menuButtons = document.querySelectorAll('button.menu'),
		$closeButton = $('button.close'),
		$nav = $('nav.post-menu'),
		menuOpener = function(e) {
			e.stopPropagation();
			$nav.classList.toggle('show');
		}, i;


	for(i=0; i<$menuButtons.length; i++) {
		$menuButtons[i].addEventListener('click', menuOpener);
		$menuButtons[i].addEventListener('touchstart', menuOpener);
	}

	$closeButton.addEventListener('click', function() {
		$nav.classList.remove('show');
	});

})();