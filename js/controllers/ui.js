var Ui = (function(window, document, $){

	//private vars
	var _toggle = false;

	//constructor method
	var ui = function(){




		//Stop propagation on children of main menu====//
		$(document).on('click', 'li', function(event){
			event.stopPropagation();
		});




		//Playlist menu dropdown interaction=======//
		$(document).on('click', '.li-playlist', function(event){

			var selector = '.playlist-dropdown';
			var id = $(this).attr('data-id');

				//runs appropriate off/on function for playlist selector
				if(!_toggle){
					toggleFalse(selector, id)
				}else{
					toggleTrue(selector, id)
				};
		});




		//Main menu dropdown interaction=======//
		$(document).on('click', '.dropdown-trigger', function(event){

			var selector = '.main-dropdown';
			var id = $(this).attr('data-id');

				//runs appropriate off/on function for playlist selector
				if(!_toggle){
					toggleFalse(selector, id)
				}else{
					toggleTrue(selector, id)
				};
		});






	};//constructor function

	//methods and properties.
	ui.prototype = {
		constructor : ui
	};

	//return constructor
	return ui;










//================================//
//Class methods===================//
//================================//


	//event false state
	function toggleFalse(selector, id){
		//clears previously open
		$(selector).fadeOut();

		//if an id is set, get data-id
		if(id === null || id === "" || id === undefined){
			$(selector).fadeIn();
		}else{
			$(selector + '[data-id=' + id + ']').fadeIn();
		}

		_toggle = !_toggle;
	}//off




	//event true state
	function toggleTrue(selector, id){

		//if an id is set, get data-id
		if(id === null || id === "" || id === undefined){
			$(selector).fadeOut();
		}else{
			$(selector + '[data-id=' + id + ']').fadeOut();
		}

		_toggle = !_toggle;
	}//on
})(window, document,jQuery);




