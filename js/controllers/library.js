var Library = (function(window, document, $){

	//private vars
	var _addedToLibrary = false;
	var _libraryId 		= '';






	//constructor fuction
	var library = function(){




		//Add/Remove song to/from library========//
		$(document).on('click', '.addToLibrary', function(event){
			var id = $(this).attr('data-id');
			var libraryId = $(this).attr('data-libid');
			var check = $(this).find('.add-icon').attr('src', 'images/icons/check.png');

			this.toggle;

			//Ensures add song run if library check mark
			if(check){
				this.toggle = this.toggle;
			}

			//Check to see if library id exists. If not, then this is a search result list
			//Ensure click adds to library via this.toggle true
			if(!libraryId || libraryId == " " || libraryId == null || libraryId == undefined){
				this.toggle = !this.toggle;
			}






			//Handles adding and removing functions and button image swap
			if(this.toggle){

				//retrieve clicked song user id
				var userId = $(this).attr('data-user');

				//Mark song in result list as "in library"
				$(this).attr('data-in-library', 'true');

				//Adds song to library
				addSongToLibrary(id, userId);



				//Swaps out icon
				$(this).find('.add-icon').attr('src', 'images/icons/check.png');

				this.toggle = !this.toggle;



			}else{//Remove song from library



				//retrieve clicked song user id
				var userId = $(this).attr('data-user');

				//Mark song in result list as "in library"
				$(this).attr('data-in-library', 'false');

				//Removes song fom library
				removeSongFromLibrary(id, userId);


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










	function removeSongFromLibrary(id, userId){

		//Build API url
		var API_URL = 'http://localhost:8887/remove-from-library/' + id + '/' + userId;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){
				console.log(response, "remove song to library response");

				//Dispatches event to application for library reloading in content controller
				$.event.trigger({
					type : 'songremoved'
				});
			}//success
		});//ajax


	}









})(window, document,jQuery);
