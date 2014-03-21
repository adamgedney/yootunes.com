$(function(){


//Parallax bg controller
var parallax = {};
	parallax.yPos = 0;
	parallax.hero = $('.hero');
	parallax.position = $(window).scrollTop();
	parallax.current = 0;

$(window).on('scroll', function(){

	//Sets current reference point
	var scroll = $(window).scrollTop();

	//checks difference between start position and current
	if(scroll > parallax.position ){
		parallax.yPos -= .8;
	}else{
		parallax.yPos += .8;
	}

	//resets background once out of viewport to fix a presentation bug
	if(scroll > 680){
		parallax.yPos = 0;
	}

	//animates background image in hero
	parallax.hero.css({
		'backgroundPosition' : '0 ' + parallax.yPos + 'px'
	});

	//sets position eqal to current scroll to increment difference
	parallax.position = scroll;
}); // onscroll





});// function