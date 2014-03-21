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
		parallax.yPos -= 1.5;
	}else{
		parallax.yPos += 1.5;

		//resets background once out of viewport to fix a presentation bug
		if(scroll > 680){
			parallax.yPos = -1;
		}
	}



	//animates background image in hero
	parallax.hero.css({
		'backgroundPosition' : '0 ' + parallax.yPos + 'px'
	});

	//sets position eqal to current scroll to increment difference
	parallax.position = scroll;
}); // onscroll






/*
* Replace all SVG images with inline SVG
Source: http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
*/
jQuery('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass+' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Replace image with new SVG
        $img.replaceWith($svg);

    }, 'xml');

});









});// function