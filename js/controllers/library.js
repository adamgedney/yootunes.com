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

				//retrieve clicked song id
				var userId = $(this).attr('data-user');

				//Mark song in result list as "in library"
				$(this).attr('data-in-library', 'true');

				addSongToLibrary(id, userId);

				console.log(userId);


				//Swaps out icon
				$(this).find('.add-icon').attr('src', 'images/icons/check.png');

				this.toggle = !this.toggle;

			}else{//Remove song form library


				//Swaps out icon
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





	function addSongToLibrary(id, userId){

		//Build API url
		var API_URL = 'http://localhost:8887/add-to-library/' + id + '/' + userId;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){
				console.log(response, "add song to library response");
			}//success
		});//ajax


	}









	function removeSongFromLibrary(){



	}









})(window, document,jQuery);
