var Library = (function(window, document, $){

	//private vars
	var _addedToLibrary = false;






	//constructor fuction
	var library = function(){




		//Add song to library========//
		$(document).on('click', '.addToLibrary', function(event){
			var id = $(this).attr('data-id');
				this.toggle

			//Handles adding and removing functions and button image swap
			if(!this.toggle){
				console.log(id, 'song id -song added to lib');

				$(this).find('.add-icon').attr('src', 'images/icons/check.png');

				this.toggle = !this.toggle;
			}else{
				console.log(id, 'song id -song REMOVED from lib');

				$(this).find('.add-icon').attr('src', 'images/icons/add.png');

				this.toggle = !this.toggle;
			}


		});






	};//constructor function
	//================================//






	//methods and properties.
	library.prototype = {
		constructor  : library
		// getApp 			: getApp,
		// getPlaylists	: getPlaylists,
		// getLibrary		: getLibrary,
		// getSong 		: getSong,
		// getSongs		: getSongs,
		// getArtists		: getArtists,
		// getAlbums		: getAlbums
	};

	//return constructor
	return library;









//================================//
//Class methods===================//
//================================//






})(window, document,jQuery);
