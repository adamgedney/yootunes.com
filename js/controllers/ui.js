var Ui = (function(window, document, $){


	//Instances
	var _key = new KeyHash();


	//private vars
	var _seek 				= {};
		_seek.drag,
		_seek.seekTime,
		_seek.seekScrub,
		_seek.seekBarWidth,
		_seek.seekBarLeft,
		_seek.seekBarRight;

	var _video 				= {};
		_video.frame,
		_video.ctrls;

	var _videoSize 			= {};
		_videoSize.normal 	= false,
		_videoSize.full 	= false,
		_video.frame 		= $('.app iframe'),
		_video.ctrls 		= $('.video-size-ctrl');





	//constructor method
	var ui = function(){





		//Stop propagation on children of main menu====//
		$(document).on('click', 'li', function(event){
			event.stopPropagation();
		});





		//Playlist menu dropdown interaction==========//
		$(document).on('click', '.li-playlist', function(event){

			this.toggle;

			var selector = '.playlist-dropdown';
			var id = $(this).attr('data-id');

			//returns the opposite boolean toggle value
			this.toggle = toggleUi(this.toggle, selector, id);

		});





		//Main menu dropdown interaction=============//
		$(document).on('click', '.dropdown-trigger', function(event){

			this.toggle;

			var selector = '.main-dropdown';
			var id = $(this).attr('data-id');

			//returns the opposite boolean toggle value
			this.toggle = toggleUi(this.toggle, selector, id);
		});





		//Add to playlist sub menu interaction=========//
		$(document).on('click', '.add-to-playlist-menu-trigger', function(event){

			var that = this;
			that.toggle;

			var selector = '.add-to-playlist-menu';
			var id = null;

			//returns the opposite boolean toggle value
			that.toggle = toggleUi(that.toggle, selector);



			//listens for other sub menu events to fire
			//to close this and flip toggle.
			$(document).on('subOpen', function(event){
				if(event.selector !== selector && that.toggle){

					that.toggle = false;
					$(selector).fadeOut();
				}
			});
		});





		//Improve data sub menu interaction=========//
		$(document).on('click', '.improve-meta-menu-trigger', function(event){

			var that = this;
			that.toggle;

			var selector = '.improve-meta-sub-menu';
			var id = null;

			//returns the opposite boolean toggle value
			that.toggle = toggleUi(that.toggle, selector);



			//listens for other sub menu events to fire
			//to close this and flip toggle.
			$(document).on('subOpen', function(event){
				if(event.selector !== selector && that.toggle){

					that.toggle = false;
					$(selector).fadeOut();
				}
			});
		});




		//Player seek bar ui controller===//
		//================================//
		//mousedown to start drag operation
		$(document).on('mousedown', '#seek-dot', function(event){

			var scrubber 			= '#seek-dot';
				_seek.seekBarWidth 	= $('.seek-line').width(),
				_seek.seekBarLeft 	= $('.seek-line').offset().left,
				_seek.seekBarRight 	= $('.seek-line').offset().left + _seek.seekBarWidth,
				_seek.drag 			= true;

			//required to prevent text selection on mouseout of seekBar
			event.preventDefault();

			//calls the seek bar controller
			moving(scrubber);
		});


		//mouseup to stop drag
		$(document).on('mouseup', function(e){
			_seek.drag = false;
		});










		//Player Screensize Handlers======//
		//================================//
		//Minimize or show Normal video size
		$(document).on('click', '#video-min', function(){

			//Sets video to normal size
			if(!_videoSize.normal){

				showNormalSize();

				_videoSize.normal = !_videoSize.normal;
				_videoSize.full = false;

			//Sets video to minimized size
			}else{
				showMinSize();

				_videoSize.normal = !_videoSize.normal;
				_videoSize.full = false;
			}
		});





		//Fullscreen handlers
		$(document).on('click', '#video-full', function(){

			//If video is not already full
			if(!_videoSize.full){
				enterFullscreen();

				_videoSize.full = !_videoSize.full;
				_videoSize.normal = true;
			}else{
				leaveFullscreen();

				_videoSize.full = !_videoSize.full;
				_videoSize.normal = false;
			}
		});





		//Esc fullscreen handler
		$(document).on('keydown', function(){
			if(_key.Esc){

				leaveFullscreen();

				_videoSize.full = !_videoSize.full;
				_videoSize.normal = false;
			}
		});











	};//constructor function
	//================================//

	//methods and properties.
	ui.prototype = {
		constructor : ui
	};

	//return constructor
	return ui;










//================================//
//Class methods===================//
//================================//

	//Button/menu interaction controllers====//
	//toggle Controller===========//
	function toggleUi(toggle, selector, id){

		this.toggle = toggle;

		//clears previously open li in ul, if open
		$(selector).fadeOut();

		//Check for provided id
		if(id === null || id === "" || id === undefined){

			//Fade in
			if(!this.toggle){
				$(selector).fadeIn();

				//custom event for notifying sub menu handler of new sub menu open
				$.event.trigger({
					type	: "subOpen",
					selector: selector
				});

			//Fade out
			}else{
				$(selector).fadeOut();
			}

		//runs if providing event comes w/ a specific id
		}else{

			//Fade in
			if(!this.toggle){
				$(selector + '[data-id=' + id + ']').fadeIn();

				//custom event for notifying sub menu handler of new sub menu open
				$.event.trigger({
					type	: "subOpen",
					selector: selector
				});

			//Fade out
			}else{
				$(selector + '[data-id=' + id + ']').fadeOut();
			}
		}

			return this.toggle = !this.toggle;
	}//toggleUi










	//Seek bar drag functionality====//
	function moving(scrubber){

		$(document).on('mousemove', function(e){
			// var set-time = ((e.pageX - seek.seekBarLeft) / seek.seekBarWidth) * seek.duration;

			//if dragging is true, allow scrubber to move
			if(_seek.drag){

				$(scrubber).offset({left: e.pageX});

				_seek.seekScrub = $(scrubber).offset().left;


				//creates a perimeter scrubber can't leave
				if(_seek.seekScrub < _seek.seekBarLeft){
					$(scrubber).offset({left: _seek.seekBarLeft});

				}else if(_seek.seekScrub > (_seek.seekBarRight  - $(scrubber).width())){
					$(scrubber).offset({left: (_seek.seekBarRight - $(scrubber).width())});

				};
			};
		});
	};










	//Player screensize functions=======//
	//Controls entering fullscreen iframe manipulation
	function enterFullscreen(){

		_video.frame.css({
			'position' : 'absolute',
			'top'      : '0',
			'bottom'   : '0',
			'left'     : '0',
			'right'    : '0',
			'height'   : '100%',
			'width'    : '100%',
			'display'  : 'block'
		});

		_video.ctrls.css({
			'bottom'     : '0',
			'background' : 'none',
			'textAlign'  : 'left'
		});
	}










	//Controls exiting fullscreen iframe manipulation
	function leaveFullscreen(){

		_video.frame.css({
				'position' : 'absolute',
				'top'      : 'initial',
				'bottom'   : '72px',
				'left'     : '0',
				'right'    : 'initial',
				'height'   : '27px',
				'width'    : '25%'
			});

		_video.ctrls.css({
			'bottom'     : '72px',
			'background' : '#0f1010',
			'textAlign'  : 'right'
		});
	};









	//Controls minimizing the video
	function showNormalSize(){

		_video.frame.css({
			'height'   : '227px',
			'display'  : 'block',
			'position' : 'absolute',
			'top'      : 'initial',
			'bottom'   : '72px',
			'left'     : '0',
			'right'    : 'initial',
			'width'    : '25%'
		});
	}









	//Controls minimizing the video
	function showMinSize(){

		_video.frame.css({
			'position' : 'absolute',
			'top'      : 'initial',
			'bottom'   : '72px',
			'left'     : '0',
			'right'    : 'initial',
			'height'   : '27px',
			'display'  : 'none',
			'width'    : '25%'
		});

		_video.ctrls.css({
			'bottom'     : '72px',
			'background' : '#0f1010',
			'textAlign'  : 'right'
		});
	}


})(window, document,jQuery);



