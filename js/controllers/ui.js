var Ui = (function(window, document, $){

	//private vars
	// var _foo = 'bar';


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


	//toggle Controller===========//
	function toggleUi(toggle, selector, id){

		this.toggle = toggle;

		//clears previously open in li, if open
		$(selector).fadeOut();

		//if an id is set, get data-id else run without it
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


})(window, document,jQuery);




