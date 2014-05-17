(function(){
define(['jquery', 'Player'], function($, Player){




	var _seek 				= {};
		_seek.drag,
		_seek.seekTime,
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

			var scrubber 			= thumb;
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
			moving(scrubber);


		}).bind('mouseup', function(e){
			if(_seek.drag === true){

				Player.prototype.dragging(false, _seek.seekScrub);
				_seek.drag = false;
			}
		});

	}









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






	return slider;





});//define()
})();//function