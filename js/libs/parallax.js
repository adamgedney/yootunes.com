(function(){
require(['jquery'], function($){



	//Parallax bg controller==================//
	var parallax = {};
		parallax.yPos = 0;
		parallax.hero = $('section.hero');
		parallax.position = $(window).scrollTop();
		parallax.current = 0;

	$(window).on('scroll', function(){


		//Sets current reference point
		var scroll = $(window).scrollTop();

		//checks difference between start position and current
		if(scroll > parallax.position ){
			parallax.yPos -= 1.5;
		}else{
			parallax.yPos += 1.5;

			//resets background once out of viewport to fix a presentation bug
			if(scroll > 680){
				parallax.yPos = -1;
			}
		}


		var value = '0 ' + parallax.yPos + 'px';

		//animates background image in hero
		$('section#top').css('background-position' , value);

		//sets position equal to current scroll to increment difference
		parallax.position = scroll;
	}); // onscroll






});//define
})();// function