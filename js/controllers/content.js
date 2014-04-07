//Content is essentially a view controller
var Content = (function(window, document, $){

	//Instances
	// var _library 	= new Library();
	// var _user		= new User();


	//private vars
	var _songs 			= [];
	var	_userId			= '';
	var	_userEmail 		= '';
	var _userSongs;
	var _sortBy			= 'def';
	var _sortOrder		= 'def';
	var _currentContent = '';




	//constructor method
	var content = function(){


		//NOTE: add click unbinds
		// $(".bet").unbind().click(function() {
		// //Stuff
		// });


		//Acct Settings page load interaction=========//
		$(document).on('click', '#acctSettings', function(event){

			loadAcctSettings();
		});




		//Device Settings page load interaction=========//
		$(document).on('click', '#deviceSettings', function(event){

			loadDeviceSettings();
		});




		//Songs library page load interaction=========//
		$(document).on('click', '.viewSongs', function(event){

			var by = "youtube_title";

			sortList(by);

		});




		//Artists library page load interaction=========//
		$(document).on('click', '.viewArtists', function(event){

			var by = "artist";

			sortList(by);
		});




		//Albums library page load interaction=========//
		$(document).on('click', '.viewAlbums', function(event){

			var by = "album";

			sortList(by);
		});




		//Genres library page load interaction=========//
		$(document).on('click', '.viewGenres', function(event){

			var by = "genre";

			sortList(by);

		});




		//Playlist page load interaction=========//
		$(document).on('click', '.playlistTitle', function(event){

			//Grabs playlist id for specific loading
			var playlistId = $(this).attr('data-id');
			// console.log(id, 'this is the clicked playlist id');

			//Get & load playlist songs
			loadPlaylistSongs(playlistId);
		});





		//Search call and result looping=========//
		$(document).on('click', '#searchSubmit', function(event){
			event.preventDefault();
			var query = $('#searchInput').val();
			var API_URL = 'http://localhost:8887/search/' + query;
			var songs = [];

			//Search query call
			$.ajax({
				url 		: API_URL,
				method 		: 'GET',
				dataType	: 'json',
				success 	: function(data){

					//Loop through response & push into array
					//for delivery to renderer
					for(var i=0;i<data.length;i++){

						songs.push(data[i]);
					}

					//Send results to renderer
					loadQueryResults(songs);

					//pass data to private var
					//after loading new results
					_songs = songs;

				}//success
			});//ajax
		});//click




		//Reload previous search into main content view
		$(document).on('click', '#returnToSearch', function(event){

			//Send previous results back to renderer
			loadQueryResults(_songs);

		});




		//Listens for user to log in to load library for user
		$(document).on('userloggedin', function(event){

			_userId 	= event.userId;
			_userEmail 	= event.email;
		});










		//Makes synchronous
		//Listens for loadApp content renderer complete
		$(document).on('rendered', function(event){

			if(event.template === '#app'){

				//Load library items
				loadLibrary();

				//Load playlists
				loadPlaylists();

			}//if #app




			if(event.template === '#libraryItem'){

				//Loop through li items to see if song is in library
				for(var i=0;i<_userSongs.length;i++){

					//Gets the song_id from the displayed result item
					var itemId = $('li.resultItems:eq(' + i + ')').find('.addToLibrary').attr('data-id');

						//Checks result item against user's library stored locally
						//Sets trash/add icon accordingly
						if(_userSongs[i].song_id === itemId){
							//Swaps out icon for trash icon
							$('li.resultItems:eq(' + i + ')').find('.addToLibrary').find('.add-icon').attr('src', 'images/icons/trash-icon.svg');

						}else{

							//Swaps out icon for add icon
							$('li.resultItems:eq(' + i + ')').find('.addToLibrary').find('.add-icon').attr('src', 'images/icons/add.png');
						}
				}//for

				//Hide DOM nodes
				hideNodes();

				//Load sub menu playlists
				loadSubPlaylists();


				//data-in-library="false"
			}//#libraryItem event
		});//onRendered






		//Reload library when song removed form library
		$(document).on('songremoved', function(){

			//Load library items
			loadLibrary();
		});





		//Reload playlists when new playlist added
		$(document).on('playlistadded', function(){

			//Load playlist items
			loadPlaylists();

			//Load menu playlists
			loadSubPlaylists();
		});




		//Reload playlist after song removal
		$(document).on('playlistsongremoved', function(event){
			console.log("playlist song removed triggered", event.id);
			//Reload playlist songs after song removed
			loadPlaylistSongs(event.id)
		});
















	};//constructor function
	//================================//




	//methods and properties.
	content.prototype = {
		constructor 		: content,
		loadLanding 		: loadLanding,
		loadPlaylists		: loadPlaylists,
		loadLibrary 		: loadLibrary,
		loadApp				: loadApp
	};





	//return constructor
	return content;









//================================//
//Class methods===================//
//================================//

	//Loads landing template
	function loadLanding(){
		var src 		= '/js/views/landing.html',
			id 			= '#landing',
			appendTo 	= '#wrapper';

			data 	 	= {
				test	: ''
			};



		render(src, id, appendTo, data);
	}









	//Loads app template
	function loadApp(){
		var src 		= '/js/views/app.html',
			id 			= '#app',
			appendTo 	= '#wrapper';

			data 	 	= {
				test	: ''
			};



		render(src, id, appendTo, data);

		//Loads any scripts needing dynamic insertion
		loadScripts();
	}









	//Loads any scripts needing dynamic insertion
	function loadScripts(){

		//Load YouTube Player API scripts
		var tag = document.createElement('script');
			tag.src = "http://www.youtube.com/player_api";

		var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		//End YouTube Player API scripts
	}









	//Gets data & Loads playlist template
	function loadPlaylists(){
		var src 		= '/js/views/playlist.html',
			id 			= '#playlist',
			appendTo 	= '#playlistWrapper';


		//Build API request
		var API_URL = 'http://localhost:8887/get-playlists/' + _userId;


		//Call API for user's playlist
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success 	: function(response){


				data 	 	= {
					playlist: response
				};

				console.log(response[1], "playlists response");

				//Shows column headers
				$('.li-header').show();

				//Render playlist items w/ playlist data
				render(src, id, appendTo, data);

			}//success
		});//ajax


	}









	//Gets data & Loads playlist template
	function loadSubPlaylists(){
		var src 		= '/js/views/subPlaylist.html',
			id 			= '#subPlaylist',
			appendTo 	= '.playlistSubScrollContainer';


		//Build API request
		var API_URL = 'http://localhost:8887/get-playlists/' + _userId;


		//Call API for user's playlist
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success 	: function(response){


				data 	 	= {
					playlist: response
				};


				//Shows column headers
				$('.li-header').show();

				//Render playlist items w/ playlist data
				render(src, id, appendTo, data);

			}//success
		});//ajax


	}









	//Gets data & Loads playlist songs
	function loadPlaylistSongs(playlistId){
		var src 		= '/js/views/library.html',
			id 			= '#libraryItem',
			appendTo 	= '.scroll-container';

			//Build API request
			var API_URL = 'http://localhost:8887/get-playlist-songs/' + playlistId;




			//Call API for user's library
			$.ajax({
				url 		: API_URL,
				method 		: 'GET',
				dataType 	: 'json',
				success 	: function(response){

					data 	 	= {
						song : response,
						user : {userId : _userId}
					};


					//Store the users songs for list functions
					_userSongs = response;

					//Shows column headers
					$('.li-header').show();

					//Render library items with user data
					render(src, id, appendTo, data);


					//Change last column to remove
					$('.sourceTitle').html('Remove');

				}//success
			});//ajax


	}










	//Gets data & Loads library template
	function loadLibrary(){
		var src 		= '/js/views/library.html',
			id 			= '#libraryItem',
			appendTo 	= '.scroll-container';

			//Build API request
			var API_URL = 'http://localhost:8887/get-library/' + _userId + '/' + _sortBy + '/' + _sortOrder;




			//Call API for user's library
			$.ajax({
				url 		: API_URL,
				method 		: 'GET',
				dataType 	: 'json',
				success 	: function(response){

					data 	 	= {
						song : response,
						user : {userId : _userId}
					};


					//Store the users songs for list functions
					_userSongs = response;

					//Shows column headers
					$('.li-header').show();

					//Render library items with user data
					render(src, id, appendTo, data);

					//Change last column to remove
					$('.sourceTitle').html('Remove');
				}//success
			});//ajax


		//Note: This is the data returned from API
		//album, artist, created_at, description, genre, id, img_default, img_high, img_medium
		//length, query, song_title, updated_at, youtube_id, youtube_results_id, youtube_title
	}









	function loadAcctSettings(){
		var src 		= '/js/views/acctSettings.html',
			id 			= '#acctSettings',
			appendTo 	= '.scroll-container';

			data 	 	= {
				test	: ''
			};

			//Hides column headers
			$('.li-header').hide();

		render(src, id, appendTo, data);

	}









	function loadDeviceSettings(){
		var src 		= '/js/views/deviceSettings.html',
			id 			= '#deviceSettings',
			appendTo 	= '.scroll-container';

			data 	 	= {
				test	: ''
			};

			//Hides column headers
			$('.li-header').hide();

		render(src, id, appendTo, data);
	}









	//Gets data from API & displays in list
	function loadQueryResults(songs){
		var src 		= '/js/views/library.html',
			id 			= '#libraryItem',
			appendTo 	= '.scroll-container';

			data 	 	= {
				song	: songs,
				user 	: {userId : _userId}
			};

			//Shows column headers
			$('.li-header').show();


		render(src, id, appendTo, data);


		//Change last column to remove
		$('.sourceTitle').html('Add');
	}













	//Maintains list of DOM nodes to hide on app init
	function hideNodes(){

		var selectors = ['.playlist-dropdown', 'li.main-dropdown',
		'.add-to-playlist-menu', '.improve-meta-sub-menu'];

		for(var i=0; i<selectors.length;i++){
			$(selectors[i]).hide();
		}
	}










	function render(src, id, appendTo, data){

		$.get(src, function(htmlArg){

			//Finds and populates template
			var source 		= $(htmlArg).find(id).html();
			var template 	= Handlebars.compile(source);
			var html 		= template(data);


			//Clear append container
			$(appendTo).empty();

			//Appends template into Wrapper on DOM
			$(appendTo).append(html);


			//Fires a complete event after content has been appended
			$(document).trigger({
				type		: 'rendered',
				template 	: id
			});
		});
	}









	function sortList(by){

		this.toggle;

		if(this.toggle){
			//Set the sort order
			_sortBy 	= by;
			_sortOrder 	= "ASC";

			//Load library
			loadLibrary();

			this.toggle = !this.toggle;

		}else{
			//Set the sort order
			_sortBy 	= by;
			_sortOrder 	= "DESC";

			//Load library
			loadLibrary();

			this.toggle = !this.toggle;
		}
	}



















})(window, document,jQuery);
