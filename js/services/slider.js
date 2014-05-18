(function(){
define(['jquery', 'Player'], function($, Player){




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







	var slider = function(thumb, bar, fill){

		//Player seek bar ui controller===//
		//================================//
		//mousedown to start drag operation
		$(document).on('mousedown', thumb, function(event){

				_seek.scrubber 		= thumb;
				_seek.seekBar 		= $(bar);
				_seek.seekBarWidth 	= _seek.seekBar .width(),
				_seek.seekBarLeft 	= _seek.seekBar .offset().left,
				_seek.seekBarRight 	= _seek.seekBar .offset().left + _seek.seekBarWidth,
				_seek.seekFill 		= $(fill),
				_seek.drag 			= true;

				//Notify player that we're dragging
				Player.prototype.dragging(true);

			//required to prevent text selection on mouseout of seekBar
			event.preventDefault();

			//calls the seek bar controller
			moving(_seek.scrubber);


		}).bind('mouseup', function(e){
			if(_seek.drag === true){

				Player.prototype.dragging(false, _seek.seekScrub);
				_seek.drag = false;
			}
		});




		//Extra click handler to enable click to position on seek bar
		$(document).on('click', bar, function(e){
			var scrubberReference = $(thumb);

			scrubberReference.offset({left: e.pageX});

			//set the return scrub position to the scrubberthumb
			//position set by the click position
			_seek.seekScrub = scrubberReference.offset().left;

			Player.prototype.dragging(false, _seek.seekScrub);
		});




	}















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






	return slider;





});//define()
})();//function