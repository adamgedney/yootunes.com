(function(){
define(['jquery'], function($){




// var Library = (function(window, document, $){

	//private vars
	var _addedToLibrary = false;
	var _libraryId 		= '';
	var _baseUrl 		= 'http://yooapi.pw';






	//constructor fuction
	var library = function(){




		//Add/Remove song to/from library========//
		$(document).on('click', '.addToLibrary', function(event){
			var id = $(this).attr('data-id');
			var libraryId = $(this).attr('data-libid');
			var playlistId = $(this).attr('data-playlistId');
			var check = $(this).find('.add-icon').attr('src', 'images/icons/check.png');


			//Currently displaying playlist if playlistId exists
			if(playlistId !== ""){

				//DELETES song from playlist
				deleteSongFromPlaylist(id, playlistId);

			}else{//NOT currently displayling a playlist

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
				}//this.toggle
			}//if playlistId
		});//on click








		//Create new playlist form
		$(document).on('click', '.newPlaylistSubmit', function(event){

			var userId 			= $(this).attr('data-user');
			var songId 			= $(this).attr('data-id');
			var playlistName 	= $(this).prev().val();//Previous li sibling in form = text input


			createNewPlaylist(userId, songId, playlistName);

			//Clear form on submit
			$('.newPlaylistInput').val('');

			event.preventDefault();
		});









		//Add song to playlist
		$(document).on('click', '.playlist-menu-sub-list', function(event){
			var songId 		= $(this).parent().attr('data-id');
			var playlistId 	= $(this).attr('data-playlistId');
			var userId 		= $(this).attr('data-user');
			var that 		= $(this);


			//Show checkmark affordance when song added
			var thisCheck = $(this).find('.addedToPlaylistCheck');
				thisCheck.fadeIn(100, function(){
					hideCheck(thisCheck);
				});



			//Add song to playlist
			addSongToPlaylist(songId, playlistId, userId);
		});









		//Delete playlist
		$(document).on('click', '.deletePlaylist', function(event){
			var playlistId 	= $(this).attr('data-id');

			deletePlaylist(playlistId);
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
		var API_URL = _baseUrl + '/add-to-library/' + id + '/' + userId;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				if(response === true){
					//Display total songs in library in interface
					var currentNumber = $('#collectionTotal').html();
					$('#collectionTotal').html(parseInt(currentNumber) + 1);
				}
			}//success
		});//ajax


	}










	function removeSongFromLibrary(id, userId){

		//Build API url
		var API_URL = _baseUrl + '/remove-from-library/' + id + '/' + userId;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				//Dispatches event to application for library reloading in content controller
				$.event.trigger({
					type : 'songremoved'
				});

				//Indicate song was removed in Library songs display in sidebar
				if(response === true){

					//Display total songs in library in interface
					var currentNumber = $('#collectionTotal').html();
					$('#collectionTotal').html(parseInt(currentNumber) - 1);
				}

			}//success
		});//ajax
	}









	function createNewPlaylist(userId, songId, playlistName){

		//Build API url
		var API_URL = _baseUrl + '/new-playlist/' + userId + '/' + songId + '/' + playlistName;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				//Dispatches event to application for playlist reloading in content controller
				$.event.trigger({
					type : 'playlistadded'
				});
			}//success
		});//ajax


		//Adds this new song to user's library
		addSongToLibrary(songId, userId);
	}









		function addSongToPlaylist(songId, playlistId, userId){

			//Build API url
			var API_URL = _baseUrl + '/add-to-playlist/' + songId + '/' + playlistId;

			//Call API to add song to library
			$.ajax({
				url : API_URL,
				method : 'GET',
				dataType : 'json',
				success : function(response){

				}//success
			});//ajax


			//Adds this new song to user's library
			addSongToLibrary(songId, userId);
		}









		function deleteSongFromPlaylist(songId, playlistId){

			//Build API url
			var API_URL = _baseUrl + '/delete-from-playlist/' + songId + '/' + playlistId;

			//Call API to add song to library
			$.ajax({
				url : API_URL,
				method : 'GET',
				dataType : 'json',
				success : function(response){

					//Triggers playlist song deleted to trigger a playlist refresh
					$.event.trigger({
						type 	: 'playlistsongremoved',
						id 		: playlistId
					});
				}//success
			});//ajax


		}









		function deletePlaylist(playlistId){

			//Build API url
			var API_URL = _baseUrl + '/delete-playlist/' + playlistId;

			//Call API to add song to library
			$.ajax({
				url : API_URL,
				method : 'GET',
				dataType : 'json',
				success : function(response){

					//Triggers playlist added just so a playlist reload occurs
					$.event.trigger({
						type : 'playlistadded'
					});

				}//success
			});//ajax



		}








		//Called by the add to playlist submenu interaction
		function hideCheck(thisCheck){
			thisCheck.fadeOut(5000);
		}

















// })(window, document,jQuery);
});//define()
})();//function