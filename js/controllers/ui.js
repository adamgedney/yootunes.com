var Ui = (function(window, document, $){

	//private vars
	var _toggle = false;

	//constructor method
	var ui = function(){



		//Playlist menu dropdown interaction=======//
		$(document).on('click', '.li-playlist', function(event){
			//gets the id of the list item being clicked
			var id = $(this).attr('data-id');

				//runs appropriate off/on function for playlist selector
				if(!_toggle){
					toggleFalse('.playlist-dropdown', id)
				}else{
					toggleTrue('.playlist-dropdown', id)
				};
		});//onClick playlist menu


		// //Main menu dropdown interaction=======//
		// $(document).on('click', '.li-playlist', function(event){
		// 	//gets the id of the list item being clicked
		// 	var id = $(this).attr('data-id');

		// 		//runs appropriate off/on function for playlist selector
		// 		if(!_toggle){
		// 			toggleFalse('.playlist-dropdown', id)
		// 		}else{
		// 			toggleTrue('.playlist-dropdown', id)
		// 		};
		// });//onClick Main menu item






	};//constructor function

	//methods and properties.
	ui.prototype = {
		constructor : ui,
		toggleFalse : toggleFalse,
		toggleTrue : toggleTrue
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




