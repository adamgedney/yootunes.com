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
	var _baseUrl 		= 'http://localhost:8887';
	var _thisDevice;




	//constructor method
	var content = function(){














		//Acct Settings page load interaction=========//
		$(document).on('click', '#acctSettings', function(event){

			//load account settings page
			loadAcctSettings();

		});//click acctSettings
















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
			var API_URL = _baseUrl + '/search/' + query;
			var songs = [];

			//Empty results list while srarch results load
			$('.scroll-container').empty();

			//Show loading icon
			$('.loading').fadeIn();

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

					//Hide loading icon
					$('.loading').fadeOut();

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
				// loadAcctSettings();

				//Load playlists
				loadPlaylists();

				//Get Devices
				getDevices();

			}//if #app




			if(event.template === '#libraryItem'){

				//Remove search input value
				$('#searchInput').val('');

				//Set list item length to DOM for shuffle function in player controller
				$('li.resultItems:eq(' + 0 + ')').attr('data-resultLength', _userSongs.length);


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

			}//#libraryItem event




			if(event.template === '#landing'){
				//Hide DOM nodes
				hideNodes();
			}//#landing event



			//Listen for acctSettings view render
			if(event.template === '#acctSettings'){

				var API_URL = _baseUrl + '/get-user/' + _userId;


				//Get current user's data where available
				$.ajax({
					url : API_URL,
					method : 'GET',
					dataType : 'json',
					success : function(response){
						console.log(response, "acct settings call response");

						$('#infoName').val(response[0].display_name);
						$('#infoEmail').val(response[0].email);
						$('#infoId').html(response[0].id);

					}//success
				});//ajax



				//Get Devices
				getDevices();

			}//acctSettings
		});//onRendered









		//Pickup return event
		$(document).on('getDevices', function(data){
			$('#play-on').empty();
			$('#infoDeviceList').empty();


			//Loop through device list
			for(var j=0;j<data.response.length;j++){

				//===================================//
				//Settings page & app footer list
				//===================================//
				//If device is this device, set name
				if(data.response[j].name === _thisDevice){
					//Set the current device if it matches the cookie
					$('#infoDeviceName').val(data.response[j].name);
					$('#infoDeviceName').attr('data-id', data.response[j].id);

					//set footer list items first reult to the current device
					var option = '<option data-id="' + data.response[j].id + '">' + data.response[j].name + '</option>';
					$('#play-on').prepend(option);



				}else{



					//Populate SETTINGS PAGE list
					var li = '<li>' + data.response[j].name + ' <img id="deleteDevice" data-id="' + data.response[j].id + '" src="images/icons/trash-icon.svg"/></li>';
					$('#infoDeviceList').append(li);



					//Populate APP FOOTER list
					var option = '<option data-id="' + data.response[j].id + '">' + data.response[j].name + '</option>';
					$('#play-on').append(option);

				}//else
			}//for
		});//on getDevices












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











		//Forgot Password view renderer
		$(document).on('click', '#forgotPassword', function(event){
			event.preventDefault();

			loadForgotPass();
		});








		//Reload devices when one was deleted
		$(document).on('reloadDevices', function(){

			//Load devices
			getDevices();
		});
















	};//constructor function
	//================================//




	//methods and properties.
	content.prototype = {
		constructor 		: content,
		loadLanding 		: loadLanding,
		loadPlaylists		: loadPlaylists,
		loadLibrary 		: loadLibrary,
		loadApp				: loadApp,
		loadReset 			: loadReset,
		loadAcctSettings    : loadAcctSettings
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









	//Loads forgot password template
	function loadForgotPass(){
		var src 		= '/js/views/forgotPassword.html',
			id 			= '#forgot',
			appendTo 	= '#wrapper';

			data 	 	= {
				test	: ''
			};



		render(src, id, appendTo, data);
	}









	//Loads reset password template
	function loadReset(){
		var src 		= '/js/views/resetPassword.html',
			id 			= '#reset',
			appendTo 	= '#wrapper';

			data 	 	= {
				test	: ''
			};



		render(src, id, appendTo, data);
	}









	//Loads any scripts needing dynamic insertion
	function loadScripts(){

		//Load YouTube Player API scripts
		var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/player_api";

		var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		//End YouTube Player API scripts


		//Google+ Auth script
		// var po = document.createElement('script');
		//    po.type = 'text/javascript'; po.async = true;
		//    po.src = 'https://apis.google.com/js/client:plusone.js';

	 //   	var s = document.getElementsByTagName('script')[0];
	 //   		s.parentNode.insertBefore(po, s);
	   	//End Google+ auth script
	}









	//Gets data & Loads playlist template
	function loadPlaylists(){
		var src 		= '/js/views/playlist.html',
			id 			= '#playlist',
			appendTo 	= '#playlistWrapper';


		//Build API request
		var API_URL = _baseUrl + '/get-playlists/' + _userId;


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









	//Gets data & Loads playlist template
	function loadSubPlaylists(){
		var src 		= '/js/views/subPlaylist.html',
			id 			= '#subPlaylist',
			appendTo 	= '.playlistSubScrollContainer';


		//Build API request
		var API_URL = _baseUrl + '/get-playlists/' + _userId;


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
			var API_URL = _baseUrl + '/get-playlist-songs/' + playlistId;




			//Call API for user's playlist songs
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
			var API_URL = _baseUrl + '/get-library/' + _userId + '/' + _sortBy + '/' + _sortOrder;




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
		'.add-to-playlist-menu', '.improve-meta-sub-menu', '.signin',
		'#restoreAcctModal'];

		for(var i=0; i<selectors.length;i++){
			$(selectors[i]).hide();
		}
	}














	function getDevices(){
		var API_URL = _baseUrl + '/get-devices/' + _userId;

		//Get current user's devices
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				//Broadcast response
				$(document).trigger({
					type		: 'getDevices',
					response 	: response
				});

			}//success
		});//ajax
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
			_sortOrder 	= "DESC";

			//Load library
			loadLibrary();

			this.toggle = !this.toggle;

		}else{
			//Set the sort order
			_sortBy 	= by;
			_sortOrder 	= "ASC";

			//Load library
			loadLibrary();

			this.toggle = !this.toggle;
		}
	}





























})(window, document,jQuery);
