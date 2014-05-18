(function(){
define(['jquery'], function($){




	var _seek 				= {};
		_seek.drag,
		_seek.seekTime,
		_seek.scrubber,
		_seek.seekScrub,
		_seek.seekBarWidth,
		_seek.seekBarLeft,
		_seek.seekBarRight
		_seek.seekFillLeft,
		_seek.seekFillWidth;
		_seek.seekLine;


		_seek.scrubber		= '#seek-dot',
		_seek.seekPos 		= 0,
		_seek.duration 		= 0,
			_dragging 		= false;

	var sliderCntrl = {};







	var slider = function(thumb, bar, fill){

		_seek.scrubber 		= thumb;
		_seek.seekBar 		= $(bar);
		_seek.seekLine 		= $('.seek-line');

		//Player seek bar ui controller===//
		//================================//
		//mousedown to start drag operation
		$(document).on('mousedown', thumb, function(event){

				_seek.scrubber 		= thumb;
				_seek.seekBar 		= $(bar);
				_seek.seekBarWidth 	= _seek.seekBar.width(),
				_seek.seekBarLeft 	= _seek.seekBar.offset().left,
				_seek.seekBarRight 	= _seek.seekBar.offset().left + _seek.seekBarWidth,
				_seek.seekFill 		= $(fill),
				_seek.drag 			= true;

				//Notify player that we're dragging
				dragging(true);

			//required to prevent text selection on mouseout of seekBar
			event.preventDefault();

			//calls the seek bar controller
			moving(_seek.scrubber);


		}).bind('mouseup', function(e){
			if(_seek.drag === true){

				dragging(false, _seek.seekScrub);
				_seek.drag = false;
			}
		});




		// //Extra click handler to enable click to position on seek bar
		// $(document).on('click', '#seek-bar', function(e){
		// 	var scrubberReference = $(thumb);

		// 	scrubberReference.offset({left: e.pageX});

		// 	//set the return scrub position to the scrubberthumb
		// 	//position set by the click position
		// 	_seek.seekScrub = scrubberReference.offset().left;

		// 	//Tell playerjs to set the seek position
		// 	$.event.trigger({
		// 		type : 'seekto',
		// 		scrubPos : _seek.seekScrub
		// 	});
		// });




	}














	//Internal -used by slider()
	//Seek bar drag functionality====//
	function moving(scrubber){

		$(document).on('mousemove', function(e){
			// var set-time = ((e.pageX - seek.seekBarLeft) / seek.seekBarWidth) * seek.duration;
			var scrubberReference = $(scrubber);
			//if dragging is true, allow scrubber to move
			if(_seek.drag){

				scrubberReference.offset({left: e.pageX});

				_seek.seekScrub = scrubberReference.offset().left;


				//creates a perimeter scrubber can't leave
				if(_seek.seekScrub < _seek.seekBarLeft){
					scrubberReference.offset({left: _seek.seekBarLeft});

				}else if(_seek.seekScrub > (_seek.seekBarRight  - scrubberReference.width())){
					scrubberReference.offset({left: (_seek.seekBarRight - scrubberReference.width())});

				}

				//Sets seek bar backfill bar width
				_seek.seekFill.width(scrubberReference.offset().left - _seek.seekBarLeft);
			};
		});
	};












	//Internal -used by slider()
	var dragging = function(drag, scrubPos){
		_dragging = drag;

		//Seek bar dragging
		if(drag === true){
			//clear update interval to release control to seekTo function
			clearInterval(window.updateInterval);
		}else if(drag === false){

			//Set video position based on scrubPos(x pos)
			// seekTo(scrubPos);
			$.event.trigger({
				type : 'seekto',
				scrubPos : scrubPos
			});
		}
	}








	// //Internal -Used by dragging()
	// function seekTo(scrubberOffset){

	// 	var seekBar = $('#seek-bar');

	// 	//Set video time: ((scrubber x - bar left) / bar width) * duration
	// 	var s = ((scrubberOffset - seekBar.offset().left) / seekBar.width()) *_seek.duration;


	// 	//Build obj for socket transmission
	// 	var data = {
	// 		'device' 			: window.playOnDevice,
	// 		'controllerDevice' 	: window.thisDevice,
	// 		'userId' 			: window.userId,
	// 		'seconds' 			: s
	// 	}


	// 	if(_socket === 'open'){

	// 		//EMIT seekTo event back to server
	// 		_socketConnect.emit('seekTo', data);
	// 	}


	// 	//seekTo normally
	// 	_player.seekTo(s, true);
	// }










	//External - used by the playin status in playerjs
	//Updates the time in the transport view
	var updateTime = function(playerDuration, playerTime, loadedFraction){

		if(_dragging === false){

			_seek.duration 	= playerDuration;

			var time 		= playerTime;
			var h 			= 0;
			var m 			= Math.floor(time / 60);
			var secd 		= (time % 60) - 1;
			var s 			= Math.ceil(secd);
			var currentTime = $('p#current-time');
			var seekBar 	= $('#seek-bar');
			var seekDot 	= $('#seek-dot');
			var seekBuffered= $('div.seek-buffered');

			// var seek_time = ((300 / duration) * s) + _seek.stepper + $('.seek-line').offset().left;

			//Adds digit if under 10s
			if(s <= 0){
				s = '00';
			}else if(s < 10){
				s = '0' + s;
			}


			//Hour handler for time display - handles 0-13hr videos
			if(m >= 60){
				m = m - 60;
				h = 1;
			}if(h == 1 && m >= 60){
				m = m - 120;
				h = 2;
			}if(h == 2 && m >= 60){
				m = m - 60;
				h = 3;
			}if(h == 3 && m >= 60){
				m = m - 60;
				h = 4;
			}if(h == 4 && m >= 60){
				m = m - 60;
				h = 5;
			}if(h == 5 && m >= 60){
				m = m - 60;
				h = 6;
			}if(h == 6 && m >= 60){
				m = m - 60;
				h = 7;
			}if(h == 7 && m >= 60){
				m = m - 60;
				h = 8;
			}if(h == 8 && m >= 60){
				m = m - 60;
				h = 9;
			}if(h == 9 && m >= 60){
				m = m - 60;
				h = 10;
			}if(h == 10 && m >= 60){
				m = m - 60;
				h = 11;
			}if(h == 11 && m >= 60){
				m = m - 60;
				h = 12;
			}if(h == 12 && m >= 60){
				m = m - 60;
				h = 13;
			};

			var timeDisplay = m + ':' + s;

			//Set Hours in time display
			if(h === 0){
				currentTime.html(timeDisplay);
			}else{


				//Adds digit if under 10m
				if(m <= 0){
					m = '00';
				}else if(m < 10){
					m = '0' + m;
				}

				//time format
				timeDisplay  = h + ':' + m + ':' + s;

				currentTime.html(timeDisplay);
			}


			//(bar width / video duration) * time = xPos of scrubber + seekbar left
			_seek.seekPos = ((seekBar.width() / _seek.duration) * time)  + seekBar.offset().left;


			//Update scrubber position
			seekDot.offset({left: _seek.seekPos});


			//Sets seek bar colored backfill bar width
			$('.seek-fill').width(seekDot.offset().left - seekBar.offset().left);


			//Set Buffered stream indicator in seek bar
			var buffered = loadedFraction;
			seekBuffered.width((seekDot.offset().left - seekBar.offset().left) + (buffered * 100));

			//DOn't allow buffered indicator to exceed seek bar width
			if(seekBuffered.width() >= seekBar.width()){
				seekBuffered.width(seekBar.width());
			}



		}//if draggin false
	}


	//Return public methods
	sliderCntrl.slider 		= slider;
	sliderCntrl.updateTime 	= updateTime;


	return sliderCntrl;





});//define()
})();//function