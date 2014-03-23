$(function(){


/*
* Replace all SVG images with inline SVG
Source: http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
*/
$('img.svg').each(function(){
    var img = $(this);
    var imgID = img.attr('id');
    var imgClass = img.attr('class');
    var imgURL = img.attr('src');

    $.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var svg = $(data).find('svg');

        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
            svg = svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
            svg = svg.attr('class', imgClass+' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        svg = svg.removeAttr('xmlns:a');

        // Replace image with new SVG
        img.replaceWith(svg);

    }, 'xml');

});






//Parallax bg controller==================//
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












//Sign up button interaction handler=======//
$('.signin').hide();
var toggle = false;

$(document).on('click', '#sign-in-btn', function(){

	if(!toggle){
		$('.signin').fadeIn();
		toggle = !toggle;
	}else{
		$('.signin').fadeOut();
		toggle = !toggle;
	}


});



//Keycode hash============================//
var key = {
    'Backspace': 8,
    'Tab': 9,
    'Enter': 13,
    'Shift': 16,
    'Ctrl': 17,
    'Alt': 18,
    'Pause': 19,
    'Capslock': 20,
    'Esc': 27,
    'Pageup': 33,
    'Pagedown': 34,
    'End': 35,
    'Home': 36,
    'Leftarrow': 37,
    'Uparrow': 38,
    'Rightarrow': 39,
    'Downarrow': 40,
    'Insert': 45,
    'Delete': 46,
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    'a': 65,
    'b': 66,
    'c': 67,
    'd': 68,
    'e': 69,
    'f': 70,
    'g': 71,
    'h': 72,
    'i': 73,
    'j': 74,
    'k': 75,
    'l': 76,
    'm': 77,
    'n': 78,
    'o': 79,
    'p': 80,
    'q': 81,
    'r': 82,
    's': 83,
    't': 84,
    'u': 85,
    'v': 86,
    'w': 87,
    'x': 88,
    'y': 89,
    'z': 90,
    '0numpad': 96,
    '1numpad': 97,
    '2numpad': 98,
    '3numpad': 99,
    '4numpad': 100,
    '5numpad': 101,
    '6numpad': 102,
    '7numpad': 103,
    '8numpad': 104,
    '9numpad': 105,
    'Multiply': 106,
    'Plus': 107,
    'Minut': 109,
    'Dot': 110,
    'Slash1': 111,
    'F1': 112,
    'F2': 113,
    'F3': 114,
    'F4': 115,
    'F5': 116,
    'F6': 117,
    'F7': 118,
    'F8': 119,
    'F9': 120,
    'F10': 121,
    'F11': 122,
    'F12': 123,
    'equal': 187,
    'Coma': 188,
    'Slash': 191,
    'Backslash': 220
}










//========================Seek Bar drag/drop functionality=========================//

//******NOTES- convert to class to handle 2 instances for volume seek bar too
	var seek = {};
		seek.seek_time,
		seek.seek_bar_width = $('.seek-line').width(),
		seek.seek_bar_left = $('.seek-line').offset().left,
		seek.seek_bar_right = $('.seek-line').offset().left + seek.seek_bar_width,
		seek.seek_scrub,
		seek.xPos,
		seek.drag,
		seek.duration;

	//mousedown to start drag operation
	$(document).on('mousedown', '#seek_dot', function(e){
		seek.drag = true;

		//required to prevent text selection on mouseout of seek_bar
		e.preventDefault();
		moving();
	});


	//mouseup to stop drag
	$(document).on('mouseup', function(e){
		seek.drag = false;
	});


	//drag and setTime
	function moving(){
		$(document).on('mousemove', function(e){
			var set_time = ((e.pageX - seek.seek_bar_left) / seek.seek_bar_width) * seek.duration;


			//if dragging is true
			if(seek.drag){

				$('#seek_dot').offset({left: e.pageX});
				seek.seek_scrub = $('#seek_dot').offset().left;


				//creates a border
				if(seek.seek_scrub < seek.seek_bar_left){
					$('#seek_dot').offset({left: seek.seek_bar_left});

				}else if(seek.seek_scrub > (seek.seek_bar_right  - $('#seek_dot').width())){
					$('#seek_dot').offset({left: (seek.seek_bar_right - $('#seek_dot').width())});

				};
			};
		});
	};









//Video size controls===================//
var video_size = {};
	video_size.toggle1 = false;
	video_size.toggle2 = false;
	video_size.frame = $('.app iframe');
	video_size.ctrls = $('.video-size-ctrl');

$(document).on('click', '#video_min', function(){

	if(!video_size.toggle1){
		video_size.frame.css({
			'height'   : '227px',
			'display'  : 'block',
			'position' : 'absolute',
			'top'      : 'initial',
			'bottom'   : '72px',
			'left'     : '0',
			'right'    : 'initial',
			'width'    : '25%'
		});

		video_size.toggle1 = !video_size.toggle1;
		video_size.toggle2 = false;


	}else{
		video_size.frame.css({
			'position' : 'absolute',
			'top'      : 'initial',
			'bottom'   : '72px',
			'left'     : '0',
			'right'    : 'initial',
			'height'   : '27px',
			'display'  : 'none',
			'width'    : '25%'
		});


		video_size.ctrls.css({
			'bottom'     : '72px',
			'background' : '#0f1010',
			'textAlign'  : 'right'
		});

		video_size.toggle1 = !video_size.toggle1;
		video_size.toggle2 = false;
	}
});





$(document).on('click', '#video_full', function(){

	if(!video_size.toggle2){
		video_size.frame.css({
			'position' : 'absolute',
			'top'      : '0',
			'bottom'   : '0',
			'left'     : '0',
			'right'    : '0',
			'height'   : '100%',
			'width'    : '100%',
			'display'  : 'block'
		});

		video_size.ctrls.css({
			'bottom'     : '0',
			'background' : 'none',
			'textAlign'  : 'left'
		});

		video_size.toggle2 = !video_size.toggle2;
		video_size.toggle1 = true;


	}else{
		leaveFullscreen();
	}
});


//esc key for exiting fullscreen video
$(document).on('keydown', function(){
	if(key['Esc']){

		leaveFullscreen();
	}
});



function leaveFullscreen(){
	video_size.frame.css({
			'position' : 'absolute',
			'top'      : 'initial',
			'bottom'   : '72px',
			'left'     : '0',
			'right'    : 'initial',
			'height'   : '27px',
			'width'    : '25%'
		});

	video_size.ctrls.css({
		'bottom'     : '72px',
		'background' : '#0f1010',
		'textAlign'  : 'right'
	});

	video_size.toggle2 = !video_size.toggle2;
	video_size.toggle1 = false;
};









//Player control===========================//

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var player;
window.onYouTubePlayerAPIReady = function() {
  // create the global player from the specific iframe (#video)
  player = new YT.Player('video', {
    events: {
      // call this function when player is ready to use
      'onStateChange': onPlayerStateChange,
      'onReady': onPlayerReady
    }
  });
}

// 4. The API will call this function when the video player is ready.
window.onPlayerReady = function(event) {

	var t = false;
	$(document).on('click', '#play_btn', function(){

		if(!t){
			player.playVideo();
			$('#play_btn').attr('src', 'images/icons/pause.png');

			t= !t;
		}else{
			player.stopVideo();
			$('#play_btn').attr('src', 'images/icons/play_wht.png');

			t = !t;
		}
	});
};


window.onPlayerStateChange = function(event){

	if (event.data == YT.PlayerState.PLAYING) {
          console.log('huh', event.data);
          setInterval(update_time, 100);
    }
};

function update_time(){
	var time = player.getCurrentTime();

	var m = Math.floor(time / 60);
	var secd = time % 60;
	var s = Math.ceil(secd)

	$('#current_time').html(m + ':' + s);
}














//Playlist menu popout interaction=======//
$('.playlist-popout').hide();
var toggle3 = false;
$(document).on('click', '.playlist-menu', function(){

	if(!toggle3){
		$('.playlist-popout').fadeIn();

		toggle3 = !toggle3;
	}else{
		$('.playlist-popout').fadeOut();

		toggle3 = !toggle3;
	}

});

});// function