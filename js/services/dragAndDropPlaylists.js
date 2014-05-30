(function(){
define(['jquery', 'Library'], function($, Library){



	var _dragResult 		= {};
		_dragResult.origX;
		_dragResult.origY;

	var _clone 				= '';
	var _setClone 			= false;
	var _userId;

	window.dragging         = false;






	//Handles resultItems drag to playlist coordinates
	var itemDragging = function(elem, event, callback){

		//Default callback if callback not found
		if(!callback){
			var callback = function(){};
		}

		//Ensures userId is always available
		if(_userId === undefined || !_userId || _userId === '' || _userId === null){
			if(window.userId !== undefined){
				_userId = window.userId;
			}else if(getCookies.userId !== undefined){
				_userId = getCookies.userId;
				window.userId = _userId;
			}
		}



		if(window.dragging === false){

			//Set item to dragging
			window.dragging = true;

			var moving 			= false;
			var mouseIcon 		= $('img#mouseAddIcon');
			_dragResult.origX 	= elem.find('span.li-col2').offset().left;
			_dragResult.origY 	= elem.find('span.li-col2').offset().top;



				//If in dragging mode and we're moving the mouse then redraw resultItem
				$(document).on('mousemove.dragging', function(event){
					event.stopPropagation();
					console.log(event.isPropagationStopped(), "prop d&d mousemove");

					moving = true;

					if(_setClone === false){

						//Only set these values once
						_clone 		= elem.find('span.li-col2').clone().appendTo('#scroll-container');
						_setClone 	= true;

						_clone.css({
							'color' 		: '#cf2425',//red
 							'position' 		: 'absolute',
							'zIndex' 		: '999',
							'cursor'    	: 'move',
							'pointerEvents': 'none'
						});
					}//setClone





						var dragX 			= event.pageX + 15;
						var dragY 			= event.pageY - 5;
						var overPlaylist 	= getCoordinates(window.overPlaylist);

						_dragResult.X 		= event.pageX;
						_dragResult.Y 		= event.pageY;

						//Only set position when dragging
						if(window.dragging){
							_clone.offset({top:dragY, left:dragX});
						}//dragging;


						//Change cursor to add icon
						if(typeof overPlaylist != 'undefined' && _dragResult.X   >= overPlaylist.left &&  _dragResult.X   <= overPlaylist.right &&
						   		 _dragResult.Y   >= overPlaylist.top  &&  _dragResult.Y   <= overPlaylist.bottom){


							mouseIcon.css({
								'display'   : 'inline',
								'top' 		: event.pageY + 10,
								'left' 		: event.pageX + 10
							});
						}

				}).bind('mouseout.dragging', function(){
					mouseIcon.css({
						'display'   : 'none'
					});
				});//MOUSEMOVE







				//Releasing item. Check to see if we're over a playlist
				//otherwise return to original location
				$(document).on('mouseup.dragging', function(event){
					event.stopPropagation();
					console.log(event.isPropagationStopped(), "prop d&d mouseup");

					//Set item to not dragging !important
					if(moving === true){
						window.dragging 	= false;
						_setClone 			= false;
					}


					//If over new playlist, drop li-col2 title into input value
					var input 			= getCoordinates('.newPlaylistInput');
					var overPlaylist 	= getCoordinates(window.overPlaylist);

						mouseIcon.css({
							'display'   : 'none'
						});

						_clone.css({
							'transition-duration' 	: '1s',
							'cursor' 				: 'pointer'
						});


						//OVER THE CREATE PLAYLIST FORM
						if(_dragResult.X   >= input.left &&  _dragResult.X   <= input.right &&
						   _dragResult.Y   >= input.top  &&  _dragResult.Y   <= input.bottom){

							//Set input value
							var submit = $('input.newPlaylistSubmit');

							//sanitize string
							var sanitized = _clone.text().replace(/[^a-zA-Z ]/g, "")
								sanitized = sanitized.substr(0, 25);

							$('input.newPlaylistInput').val(sanitized);
							submit.attr('data-user', _clone.attr('data-user'));
							submit.attr('data-id', _clone.attr('data-id'));//song id

							//Remove clone from stage
							_clone.fadeOut(function(){
								_clone.remove();
								_clone = '';
							});



						//OVER A PLAYLIST
						}else if(typeof overPlaylist != 'undefined' && _dragResult.X   >= overPlaylist.left &&  _dragResult.X   <= overPlaylist.right &&
						   		 _dragResult.Y   >= overPlaylist.top  &&  _dragResult.Y   <= overPlaylist.bottom){//Return item to origin position

							var songId 		= _clone.attr('data-id');
							var playlistId 	= window.overPlaylist.attr('data-id');
							var user 		= _userId;


							//Add song to playist
							Library.addSongToPlaylist(songId, playlistId, user);

							//Remove clone from stage
							_clone.fadeOut(function(){
								_clone.remove();
								_clone = '';
							});



						}else{//RETURN TO ORIGINAL LOCATION

							_clone.offset({top: _dragResult.origY, left: _dragResult.origX});

							//Remove clone from stage
							_clone.fadeOut(function(){
								_clone.remove();
								_clone = '';
							});

						}//else



						callback();

						setTimeout(resetEvents, 1000);

				});//mouseup
		}//dragging === true
	}














	function resetEvents(){

		//Unbind move listener
		$(document).off('mousemove.dragging');
		//Unbind mouseup listener
		$(document).off('mouseup.dragging');
		//Unbind mouseleave
		$(document).unbind('mouseleave.dragging');
	};











	function getCoordinates(selector){

		if(typeof selector != 'undefined'){

			this.coordinates = {};
			this.item 		= $(selector);
			this.itemLeft 	= this.item.offset().left;
			this.itemRight 	= this.item.offset().left + this.item.width();
			this.itemTop 	= this.item.offset().top;
			this.itemBottom = this.item.offset().top + this.item.height();

			this.coordinates.top 	= this.itemTop,
			this.coordinates.right 	= this.itemRight,
			this.coordinates.bottom = this.itemBottom,
			this.coordinates.left 	= this.itemLeft,
			this.coordinates.height = this.item.height(),
			this.coordinates.width 	= this.item.width();

			return this.coordinates;
		}
	}






	return itemDragging;





});//define()
})();//function