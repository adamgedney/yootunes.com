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

			this.toggle;

			var selector = '.playlist-dropdown';
			var id = $(this).attr('data-id');

			this.toggle = toggleUi(this.toggle, selector, id);

			console.log(this.toggle);
		});




		//Main menu dropdown interaction=======//
		$(document).on('click', '.dropdown-trigger', function(event){

			this.toggle;

			var selector = '.main-dropdown';
			var id = $(this).attr('data-id');

			this.toggle = toggleUi(this.toggle, selector, id);
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
	function toggleUi(toggle, selector, id){

		this.toggle = toggle;

		//clears previously open
		$(selector).fadeOut();

		//if an id is set, get data-id
		if(id === null || id === "" || id === undefined){

			if(!this.toggle){
				$(selector).fadeIn();
			}else{
				$(selector).fadeOut();
			}

		}else{

			if(!this.toggle){
				$(selector + '[data-id=' + id + ']').fadeIn();
			}else{
				$(selector + '[data-id=' + id + ']').fadeOut();
			}
		}

			return this.toggle = !this.toggle;

	}//toggleUi


})(window, document,jQuery);




