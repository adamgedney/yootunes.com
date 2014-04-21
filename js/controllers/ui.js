var Ui = (function(window, document, $){


	//Instances
	var _key 		= new KeyHash();
	// var _content 	= new Content();



	//private vars
	var _seek 				= {};
		_seek.drag,
		_seek.seekTime,
		_seek.seekScrub,
		_seek.seekBarWidth,
		_seek.seekBarLeft,
		_seek.seekBarRight
		_seek.seekFillLeft,
		_seek.seekFillWidth;

	var _videoSize 			= {};
		_videoSize.normal 	= false,
		_videoSize.full 	= false;





	//constructor method
	var ui = function(){



		//Sign up button interaction handler=======//
		$(document).on('click', '#sign-in-btn', function(){

			this.toggle;

			var selector = '.signin';
			var id = $(this).attr('data-id');

			//returns the opposite boolean toggle value
			this.toggle = toggleUi(this.toggle, selector, id);

		});//sing-in-button click







		//Stop propagation on children of main menu====//
		$(document).on('click', 'li', function(event){
			event.stopPropagation();
		});





		//Playlist menu dropdown interaction==========//
		$(document).on('click', '.playlist-menu', function(event){

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











		//Player seek bar ui controller===//
		//================================//
		//mousedown to start drag operation
		$(document).on('mousedown', '#seek-dot', function(event){

			var scrubber 			= '#seek-dot';
				_seek.seekBarWidth 	= $('.seek-line').width(),
				_seek.seekBarLeft 	= $('.seek-line').offset().left,
				_seek.seekBarRight 	= $('.seek-line').offset().left + _seek.seekBarWidth,
				_seek.seekFill 		= $('.seek-fill'),
				_seek.drag 			= true;

				app.player.dragging(true);

			//required to prevent text selection on mouseout of seekBar
			event.preventDefault();

			//calls the seek bar controller
			moving(scrubber);
		});


		//mouseup to stop drag
		$(document).on('mouseup', function(e){

			if(_seek.drag === true){

				app.player.dragging(false, _seek.seekScrub);
				_seek.drag = false;
			}


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

				showNormalSize();

				_videoSize.full = !_videoSize.full;
				_videoSize.normal = false;
			}
		});





		//Esc fullscreen handler
		// $(document).on('keydown', function(){
		// 	if(_key.Esc){

		// 		showNormalSize();

		// 		_videoSize.full = !_videoSize.full;
		// 		_videoSize.normal = false;
		// 	}
		// });








		//CLick handler for share link alert box
		$(document).on('click', '.linkShare', function(event){
			var link = $(this).attr('href');

			//Send link text to alert window
			copyToClipboard(link);

			event.preventDefault();
			return false;
		});









		//Modal close funcitonality
		$(document).on('click', '.modalCloseIcon', function(){

			//Hide modal window nodes
			$('#restoreAcctModal').fadeOut();
			$('#deleteAcctModal').fadeOut();
			$('#nameDeviceModal').fadeOut();
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

				}

				//Sets seek bar backfill bar width
				_seek.seekFill.width($(scrubber).offset().left - _seek.seekBarLeft);
			};
		});
	};










	//Player screensize functions=======//
	//Controls entering fullscreen iframe manipulation
	function enterFullscreen(){

		$('iframe#video').css({
			'position' : 'absolute',
			'top'      : '0',
			'bottom'   : '0',
			'left'     : '0',
			'right'    : '0',
			'height'   : '100%',
			'width'    : '100%',
			'display'  : 'block'
		});


		$('.video-size-ctrl').css({
			'top'     	 : '9px',
			'left' 		 : '9px',
			'background' : 'none',
			'textAlign'  : 'left',
			'border'     : 'none'
		});


		$('.footer').css({
			'opacity' : '.8'
		});
	}












	//Controls minimizing the video
	function showNormalSize(){

		$('iframe#video').css({
			'height'   : '227px',
			'display'  : 'block',
			'position' : 'absolute',
			'top'      : 'initial',
			'bottom'   : '72px',
			'left'     : '0',
			'right'    : 'initial',
			'width'    : '25%'
		});

		$('.video-size-ctrl').css({
			'bottom'     : '72px',
			'background' : '#0f1010',
			'textAlign'  : 'right',
			'top'     	 : 'initial',
			'left' 		 : 'initial',
		});

		$('.footer').css({
			'opacity' : '1'
		});
	}









	//Controls minimizing the video
	function showMinSize(){

		$('iframe#video').css({
			'position' : 'absolute',
			'top'      : 'initial',
			'bottom'   : '72px',
			'left'     : '0',
			'right'    : 'initial',
			'height'   : '27px',
			'display'  : 'none',
			'width'    : '25%'
		});


		$('.video-size-ctrl').css({
			'bottom'     : '72px',
			'background' : '#0f1010',
			'textAlign'  : 'right',
			'top'     	 : 'initial',
			'left' 		 : 'initial',
		});

		$('.footer').css({
			'opacity' : '1'
		});
	}









	//Notify user of link to be copied
	function copyToClipboard(link){
	  window.prompt("Copy to clipboard: Ctrl+C, Enter", link);
	}


})(window, document,jQuery);




