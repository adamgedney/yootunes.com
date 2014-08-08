(function(){
define(['jquery', 'Handlebars', 'getCookies', 'activeItem', 'sortContent', 'getUserDevices', 'determineDevice', 'Init', 'User', 'Ui', 'Library'],
	function($, handlebars, getCookies, activeItem, sortContent, getUserDevices, determineDevice, Init, User, Ui, Library){




	//private vars
	var _baseUrl 		= 'http://api.atomplayer.com';
	var _songs 			= [];
	var	_userId			= window.userId;
	var	_userEmail 		= '';
	var _userSongs 		= [];
	var _sortBy			= 'def';
	var _sortOrder		= 'def';
	var _currentContent = '';
	var _thisDevice;
	var _playlistShared = 0;

	var _libraryChanged = false;
	var _libraryCount;
	var _loadInterval;

	window.state 		= 'library';

	//CSS breakpoints
	var app_break_smmd 	= '800';






	//Dropbox api experiment
		// var apiUrl = _baseUrl  + '/db'
		// $.ajax({
		// 	url : apiUrl,
		// 	type: 'GET',
		// 	dataType: 'json',
		// 	success : function(response){
		// 		console.log("response", response);
		// 	}
		// });



		//Acct Settings page load interaction=========//
		$(document).on('click', '#acctSettings', function(event){

			//load account settings page
			loadAcctSettings();

			window.state 	= 'settings';


			activeItem('#acctSettings');

			//Set correct container height
			$('#scroll-container').css('height', '100vh');

		});//click acctSettings













		//Playlist page load interaction=========//
		$(document).on('click', '.playlistTitle', function(event){

			//Grabs playlist id for specific loading
			var playlistId = $(this).attr('data-id');

			//Get & load playlist songs
			loadPlaylistSongs(playlistId);

			activeItem(playlistId);

			$('div.section-header').show();

			//Set correct container height
			$('#scroll-container').css('height', '74vh');
		});









		//Clear autocomplete in case user wants out
		$(document).on('click', '#searchInput', function(event){
			//Empty autocomplete
			$('#datalistContainer').empty();
		});



		//Show search history when user starts typing
		$(document).on('keyup', '#searchInput', function(event){

			var datalist = $('#datalistContainer');

			//Send first 2 characters to API for querying history
			if($(this).val().length >= 2){
				var characters = $(this).val();

				var API_URL = _baseUrl + '/get-search-history/' + _userId + '/' + characters;

				//Search query call
				$.ajax({
					url 		: API_URL,
					method 		: 'GET',
					dataType	: 'json',
					success 	: function(response){

						var displayedResults = 0;
						var startDisplay = true;
						datalist.empty();

						if(response.length !== 0){
							datalist.append('<li>Search History</li><li></li>');
						}


						//Creates list of previous queries from DB.
						for(var i=1;i<response.length;i++){
							//Always load most recent
							if(startDisplay === true){
								datalist.append('<li>' + response[0].query + '</li>');
								startDisplay = false;
							}


							//Show only unique results
							if(response[i].query !== response[i-1].query){
								datalist.append('<li>' + response[i].query + '</li>');

								displayedResults += 1;
							}

							//Only show 10 results
							if(displayedResults === 10){
								break;
								startDisplay = true;
							}

						}
					}//success
				});//ajax
			}//if length > 2

			//If the user backspaced out of search then empty datalist
			if(event.keyCode === 8 && $('#searchInput').val() === ''){
				//Empty autocomplete
				datalist.empty();
			}
		});





		//Sets selected datlist item as the search val and clicks search
		$(document).on('click', '#datalistContainer li', function(){

			if($(this).text() !== 'Search History'){
				$('#searchInput').val($(this).text());
				$('#searchSubmit').trigger('click');
			}else{
				$(this).parent().empty();
			}


		});




		//Search call and result looping=========//
		$(document).on('click', '#searchSubmit', function(event){
			event.preventDefault();

			var query 	= $('#searchInput').val();
			var API_URL = _baseUrl + '/search/' + query + '/' + _userId;
			var songs 	= [];

			//Empty results list while srarch results load
			$('#scroll-container').empty();

			//Show loading icon
			$('div.loading').fadeIn();

			//Search query call
			$.ajax({
				url 		: API_URL,
				method 		: 'GET',
				dataType	: 'json',
				success 	: function(data){

					//Empty autocomplete
					$('#datalistContainer').empty();

					//Loop through response & push into array
					//for delivery to renderer
					for(var i=0;i<data.length;i++){

						songs.push(data[i]);
					}

					//Send results to renderer
					loadQueryResults(songs);

					window.state 	= 'query';

					//Hide loading icon
					$('div.loading').fadeOut();

					//pass data to private var
					//after loading new results
					_songs = songs;

				}//success
			});//ajax
		});//click










		//Reload previous search into main content view
		$(document).on('click', '#returnToSearch', function(event){

			//If no prev search exists, reload
			//library resetting pagination
			if(_songs.length === 0){


				//Load library items
				loadLibrary();

			}else{
				//Send previous results back to renderer
				loadQueryResults(_songs);
			}
		});







		//Listen for library controller to notify of song added or removed
		$(document).on('libraryChanged', function(event){
			_libraryChanged = true;
		});









		//on reload set shared playlist id for use in app rendered event
		$(document).on('userloggedin', function(event){
			_playlistShared = event.playlistId;

			//window.userId was set in init just before this fired
			_userId = window.userId;

			//Remove share from url
			window.history.pushState({test : ''}, '', "/");


		});











		//Reload devices in slave mode to prevent glitched controlling
		$(document).on('slaveMode', function(){

			console.log("slave mode content cont");
			getUserDevices.get(_userId, function(response){

				renderDevices(window.thisDevice, response);
			});//getDevices

		});











		//Makes synchronous
		//Listens for loadApp content renderer complete
		$(document).on('rendered', function(event){


			//ON APP RENDER========================//
			if(event.template === '#app'){

				//Show adsense ads on app load
				if(window.windowWidth > app_break_smmd){
					$('#adsense').show();
				}

				// DOM.video.show();

				//Determine device on app load
				determineDevice(function(data){});//determine



				//Ensures userId is always available
				if(_userId === undefined || !_userId || _userId === '' || _userId === null){
					if(window.userId !== undefined){
						_userId = window.userId;
					}else if(getCookies.userId !== undefined){
						_userId = getCookies.userId;
					}
				}



				//if playlistId cookie exists load playlist, else load library
				if(_playlistShared === 0 || _playlistShared === undefined|| _playlistShared === ""){


					//Load library items
					loadLibrary();



				}else{

					//Adds shared playlist to this user's account
					Library.addSharedPlaylist(_userId, _playlistShared);

					//Load library items
					// loadLibrary();

					//load the playlist songs if this was a shared playlist
					loadPlaylistSongs(_playlistShared);


					//Expires share cookie once it has been used
					document.cookie = 'share=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
				}


				//Load playlists
				loadPlaylists();
			}//if #app



			//ON LIBRARY RENDER========================//
			if(event.template === '#libraryItem'){

				var libraryWrapper 	= $('#libraryWrapper');
				var resultItems 	= libraryWrapper.find('li.resultItems');



				//Remove search input value
				$('#searchInput').val('');

				//Set list item length to DOM for shuffle function in player controller
				libraryWrapper.find('li.resultItems:eq(' + 0 + ')').attr('data-resultLength', _userSongs.length);

				//CHANGE ICON FROM TRASH TO PLUS SIGN============//
				if($('span.sourceTitle').html() === 'Add'){

					//Shrink Genre title section width
					$('.li-header span.li-col5').css({'width':'8.33333333%', 'marginRight' : '2%'});//1 col
					//Swaps out icon for add icon
					resultItems.find('span.addToLibrary').find('img.add-icon').attr('src', 'images/icons/add.png');
				}else{

					//restore li-header genre width
					$('.li-header span.li-col5').css({'width':'16.6666667%', 'marginRight' : '0'});//2 col

					resultItems.find('span.addToLibrary').find('img.add-icon').attr('src', 'images/icons/trash-icon.svg');
				}

//unecessary loop. Find another way to handle identifying songs in user's library

				// //Loop through li items to see if song is in library
				// for(var i=0;i<_userSongs.length;i++){

				// 	//Sets an index number to each li item
				// 	libraryWrapper.find('li.resultItems:eq(' + i + ')').attr('data-index', i);

				// 	// //Gets the song_id from the displayed result item
				// 	// var itemId = libraryWrapper.find('li.resultItems:eq(' + i + ')').find('span.addToLibrary').attr('data-id');

				// }//for

				//Hide DOM nodes
				hideNodes();

				//Load sub menu playlists
				loadSubPlaylists();

			}//#libraryItem event



			//ON LANDING PAGE RENDER========================//
			if(event.template === '#landing'){
				//Hide DOM nodes
				hideNodes();
			}//#landing event



			//ON ACCT SETTINGS RENDER========================//
			if(event.template === '#acctSettings'){

				//Hide ads on acct settings page
				$('#adsense').hide();

				// //Check/uncheck theme option based on current setting
				// if(window.theme === "dark"){
				// 	$('#themeDark').prop('checked', true);
				// }else{
				// 	$('#themeDark').prop('checked', false);
				// }

				// //Set the application theme colors
				// //again to ensure settings items are styled
				// //once they hit the DOM
				// if(window.theme === 'light'){
				// 	Ui.themeLight();
				// }else{
				// 	Ui.themeDark();
				// }


				//Hide the entire section header (search bar)
				$('div.section-header').hide();


				//Get User
				User.getUser(_userId, function(response){
					var birthdateIn = $('#infoBirthdate');
					var title	 	= $('#infoTitleGender');

					$('#infoName').val(response[0].display_name);
					$('#infoEmail').val(response[0].email);
					$('span#infoId').html(response[0].id);
					title.val(response[0].title);

					//Format birthdate for display
					var birthdate = response[0].birthMonth + '/' + response[0].birthDay + '/' + response[0].birthYear;

					if(birthdate === '0/0/0'){
						birthdateIn.val('4/24/14');
					}else{
						birthdateIn.val(birthdate);
					}



					//Prepend selected TITLE option
					var option1 = '<option >' + response[0].title + '</option>';
					title.prepend(option1);

						//Handle title options list
						if(response[0].title == "Mr."){
							var option2 = '<option >Mrs.</option>';
							var option3 = '<option >Ms.</option>';
							title.append(option2);
							title.append(option3);
						}else if(response[0].title == "Mrs."){
							var option2 = '<option >Mr.</option>';
							var option3 = '<option >Ms.</option>';
							title.append(option2);
							title.append(option3);
						}else if(response[0].title == "Ms."){
							var option2 = '<option >Mrs.</option>';
							var option3 = '<option >Mr.</option>';
							title.append(option2);
							title.append(option3);
						}
				});//getUser



				//Get Devices
				getUserDevices.get(_userId, function(response){
					renderDevices(window.thisDevice, response);
				});

			}//acctSettings
		});//onRendered












			//Render devices once init has retrieved them
			$(document).on('renderdevices', function(event){

				//Set this device once a new one is created

					_thisDevice = window.thisDevice;

				//Render devices
				if(event.response){

					renderDevices(window.thisDevice, event.response);
				}else{

					//Fetch as render user devices in lists and modals
					getUserDevices.get(_userId, function(response){
						renderDevices(window.thisDevice, response);

					});
				}
			});//renderdevices











		//Reload playlists when new playlist added
		$(document).on('playlistadded', function(){

			//Load playlist items
			loadPlaylists();

			//Load menu playlists
			loadSubPlaylists();
		});










		//Reload playlist after song removal
		$(document).on('playlistsongremoved', function(event){

			//Reload playlist songs after song removed
			loadPlaylistSongs(event.id)
		});











		//Forgot Password view renderer
		$(document).on('click', '#forgotPassword', function(event){
			event.preventDefault();

			loadForgotPass();
		});






		//Loadlibrary event fired form the sortContent service
		$(document).on('loadlibrary', function(){
			loadLibrary();
		});









		//Library list load graphic template interaction=========//
		$(document).on('click', '.viewSongs, .viewArtists, .viewAlbums, .viewGenres', function(event){

			//Moved here to trigger library reload every tme
			// $.event.trigger({
			// 	type : 'loadlibrary',
			// });


			//Used to set active item in activeItem service
			if($(this).hasClass('viewSongs')){
				activeItem('.viewSongs');
				var iconTarget = $('.mainViewSongs').find('img.sortIcon');
				defineMode('song-mode');
			}else if($(this).hasClass('viewArtists')){
				activeItem('.viewArtists');
				var iconTarget = $('.mainViewArtists').find('img.sortIcon');
				defineMode('artist-mode');

				loadArtists();

			}else if($(this).hasClass('viewAlbums')){
				activeItem('.viewAlbums');
				var iconTarget = $('.mainViewAlbums').find('img.sortIcon');
				defineMode('album-mode');
			}else if($(this).hasClass('viewGenres')){
				activeItem('.viewGenres');
				var iconTarget = $('.mainViewGenres').find('img.sortIcon');
				defineMode('genre-mode');
			}

		});


		//Defines a mode (artist, album, song, genre) & adds class to scroll-container
		function defineMode(className){

			$('div.main-container').removeClass().addClass('main-container graphic-mode ' + className);
		};





		//Load artist songs on click
		$(document).on('click', 'li.artist-item', function(){
			var artistName = $(this).attr('data-artist');
			loadArtistSongs(artistName);
		});












//=========================================//
//End event logic
//========================================//






	//public methods & properties.
	var exports = {
		loadLanding 		: loadLanding,
		loadPlaylists		: loadPlaylists,
		loadLibrary 		: loadLibrary,
		loadApp				: loadApp,
		loadReset 			: loadReset,
		loadAcctSettings    : loadAcctSettings,
		loadScripts 		: loadScripts
	};





	//return exports
	return exports;












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

			//Clear append container
			$(appendTo).empty();

		render(src, id, appendTo, data);
	}









	//Loads app template
	function loadApp(callback){
		var src 		= '/js/views/app.html',
			id 			= '#app',
			appendTo 	= '#wrapper';

			data 	 	= {
				test	: ''
			};

			//Clear append container
			$(appendTo).empty();


		render(src, id, appendTo, data);

		if(typeof callback === 'function'){
			callback();
		}

		//Determine device should run on app start
	}









	//Loads forgot password template
	function loadForgotPass(){
		var src 		= '/js/views/forgotPassword.html',
			id 			= '#forgot',
			appendTo 	= '#wrapper';

			data 	 	= {
				test	: ''
			};

			//Clear append container
			$(appendTo).empty();



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

			//Clear append container
			$(appendTo).empty();



		render(src, id, appendTo, data);
	}









	//Loads any scripts needing dynamic insertion
	function loadScripts(){


		//Google+ Auth script
		var po = document.createElement('script');
		   po.type = 'text/javascript'; po.async = true;
		   po.src = 'https://apis.google.com/js/client:plusone.js';

	   	var s = document.getElementsByTagName('script')[0];
	   		s.parentNode.insertBefore(po, s);
	   	//End Google+ auth script




	  //Insert lightbox script
	   	var lb = document.createElement('script');
		   lb.type = 'text/javascript'; po.async = true;
		   lb.src = 'js/libs/lightbox-2.6.min.js';

	   	var tag = document.getElementsByTagName('script')[0];
	   		tag.parentNode.insertBefore(lb, tag);
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
				// $('.li-header').show();

				//Clear append container
				$(appendTo).empty();

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
				// $('.li-header').show();

				//Clear append container
				$(appendTo).empty();

				//Render playlist items w/ playlist data
				render(src, id, appendTo, data);

			}//success
		});//ajax


	}









	//Gets data & Loads playlist songs
	function loadPlaylistSongs(playlistId){
		var src 		= '/js/views/library.html',
			id 			= '#libraryItem',
			appendTo 	= '#scroll-container';

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


					//Reset _userSongs then Store the users songs for list functions
					_userSongs = [];
					for(var i=0;i<response.length; i++){
						_userSongs.push(response[i].song_id);
					}

					//Shows column headers
					$('li.li-header').show();

					//Clear append container
					$(appendTo).empty();

					//Render library items with user data
					render(src, id, appendTo, data);

					//Change last column to ''
					$('span.sourceTitle').html('');

					window.state = 'playlist';

					//Used by playerjs to log the playlist play
					window.currentPlaylist = playlistId;

				}//success
			});//ajax
	}












	//Gets data & Loads library template
	function loadLibrary(){

		window.state 	= 'library';

		//*** Rewrite API. No more need for pagination
		var page = 0;

		//Ensures userId is always available
		if(_userId === undefined || !_userId || _userId === '' || _userId === null){
			if(window.userId !== undefined){
				_userId = window.userId;
			}else if(getCookies.userId !== undefined){
				_userId = getCookies.userId;
			}
		}



		//Ensures search bar is visible & container is
		//emptied quickly before a reload
			$('div.section-header').show();
			$('#scroll-container').empty();

			//Shows column headers
			$('li.li-header').show();





// localStorage.removeItem('library');
		//====================================//
		//Get library from local storage after checking DB library count for
		//changes originating from another machine
		//====================================//
		if(JSON.parse(localStorage.getItem('library')) !== null && _libraryChanged === false){

			//Local storage length +1 to accomodate fro ajax library array index
			var localLength = JSON.parse(localStorage.getItem('library'))[0].length + 1;

				if(window.libraryCount === localLength){

					var localResponse = JSON.parse(localStorage.getItem('library'));

					prepareLibrary(localResponse);

					console.log("pulled lib from local storage");

				}else{//Library count has changed

					//Call API for songs
					getLibrarySongs();

				}//localStorage and library don't match


		//======================================//
		}else{//No local storage found==========//
		//======================================//

			//Call API for songs
			getLibrarySongs();

		}//else localstorage
	}









	function getLibrarySongs(){
		//Build API request
		var API_URL = _baseUrl + '/get-library/' + _userId;

		//Call API for user's library
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success 	: function(response){

				prepareLibrary(response);

				//Set library to local storage
				if(localStorage){
					localStorage.setItem('library', JSON.stringify(response));

					console.log("rewrote local storage");
				}

				_libraryChanged = false;
				//compare localStorage to library?


				//Add a loading screen here that's removed once library is rendered

			}//success
		});//ajax
	}









	//Called when user clicks the library nav Artists link in the sidebar
	function loadArtists(){
		//Build API request
		var API_URL = _baseUrl + '/get-library/' + _userId;
		var appendTo= '#scroll-container';
		var src 	= '/js/views/graphicLibrary.html';
		var id 		= '#graphicLibraryItem';

		//Call API for user's library
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success 	: function(response){
			var artists 	= [];
			var artistsObj 	= [];

			//Loop through response, and extract only unique artist names
			var len = response[0].length;
			for(var i=0;i<len;i++){
				if(response[0][i].artist !== " "){
					if(artists.indexOf(response[0][i].artist) === -1){
						//Push artist name to determine unique,
						//then push obj for templating
						artists.push(response[0][i].artist);

						artistsObj.push({
							artist : response[0][i].artist,
							img : response[0][i].img_high
						});
					}

				}

				if(i === len -1){
					startRender();
				}
			}


			function startRender(){
				var data = {
					artists : artistsObj,
					user : {userId : _userId}
				};

				//Clear append container
				$(appendTo).empty();
				render(src, id, appendTo, data);
			}//render

			}//success
		});//ajax
	}









	function loadArtistSongs(artistName){
		//Build API request
		var API_URL = _baseUrl + '/get-artist/' + artistName + '/' + _userId;
		var appendTo 	= '#scroll-container';
		var src 		= '/js/views/library.html';
		var	id 			= '#libraryItem';

		//Call API for user's library
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success 	: function(response){

			var data = {
				song : response,
				user : {userId : _userId}
			};
console.log(response, data);
				//Clear append container
				$('div.main-container').removeClass().addClass('main-container');
				$(appendTo).empty();
				render(src, id, appendTo, data);
			}
		});
	}











	//Used by loadLibrary method
	function prepareLibrary(response){

		var appendTo = '#scroll-container';
		var src 		= '/js/views/library.html';
		var	id 			= '#libraryItem';

		data = {
				song : response[0],
				user : {userId : _userId}
			};


			//Only render library if this is not a shared playlist.
			//Loads shared playlist instead
			if(_playlistShared === 0 || _playlistShared === undefined|| _playlistShared === ""){
				//Render library items with user data
				render(src, id, appendTo, data);

			}else{
				//resets shared playlist after library behavior has taken place
				_playlistShared = 0;


			}

			//Change last column to ''
			$('span.sourceTitle').html('');

			//Pagination vars
			_libraryCount 	= response.count;

			//Display total songs in library in interface
			$('span#collectionTotal').html(response.count);


			//Store the users songs for list functions
			for(var i=0;i<response[0].length; i++){
				_userSongs.push(response[0][i].song_id);
			}
	}









	function loadAcctSettings(){
		var src 		= '/js/views/acctSettings.html',
			id 			= '#acctSettings',
			appendTo 	= '#scroll-container';

			data 	 	= {
				test	: ''
			};

			//Clear append container
			$(appendTo).empty();

		render(src, id, appendTo, data);

			//Hides column headers
			$('li.li-header').hide();
	}













	//Gets data from API & displays in list
	function loadQueryResults(songs){
		var src 		= '/js/views/library.html',
			id 			= '#libraryItem',
			appendTo 	= '#scroll-container';

			data 	 	= {
				song	: songs,
				user 	: {userId : _userId}
			};


			//Clear append container
			$(appendTo).empty();


		render(src, id, appendTo, data);

		//Change last column to remove
		$('span.sourceTitle').html('Add');
	}













	//Maintains list of DOM nodes to hide on app init
	function hideNodes(){

		// var selectors = ['.playlist-dropdown', 'li.main-dropdown',
		//  '.signin','#restoreAcctModal','.newPlaylistForm',
		//  '#signupContainer','#hiddenCreatePlaylistForm',
		//  '#minimizeOverlay'];



		var selectors = ['.signin','#restoreAcctModal',
		 '#signupContainer'];

		for(var i=0; i<selectors.length;i++){
			$(selectors[i]).hide();
		}

	}














	function renderDevices(thisDevice, response){

		var deviceName  	= $('#renameDeviceName');
		var playOn 			= $('select#play-on');
		var mobilePlayOn 	= $('select#mobile-play-on');
		var deviceList 		= $('#infoDeviceList');
		var userDevices 	= $('select#userDevices');

		playOn.empty();
		mobilePlayOn.empty();
		deviceList.empty();


		//Loop through device list
		for(var j=0;j<response.length;j++){

			//Render user devices
			if(response[j].id !== thisDevice){

				//Render MODAL window list
				var option 	= '<option data-id="' + response[j].id + '">' + response[j].name + '</option>';
				userDevices.append(option);


				//Populate SETTINGS PAGE list
				var li = '<li>' + response[j].name + ' <img id="deleteDevice" data-id="' + response[j].id + '" src="images/icons/trash-icon.svg"/></li>';
				deviceList.append(li);


				//Populate APP FOOTER list
				var option = '<option data-id="' + response[j].id + '">' + response[j].name + '</option>';
				playOn.append(option);
				mobilePlayOn.append(option);

			}//if


			//Send thisDevice to top of the list
			if(response[j].id === thisDevice){

				//Set ACCOUNT SETTINGS current device if it matches the cookie
				deviceName.val(response[j].name);
				deviceName.attr('data-id', response[j].id);
				var li = '<li>' + response[j].name + ' <img id="deleteDevice" data-id="' + response[j].id + '" src="images/icons/trash-icon.svg"/></li>';
				deviceList.append(li);

				//set FOOTER list items first result to the current device
				var option = '<option selected data-id="' + response[j].id + '">' + response[j].name + '</option>';
				playOn.prepend(option);
				mobilePlayOn.prepend(option);

			}
		}//for

		//Add a blank device to MODAL list
		var blank = '<option>Your Devices</option>'
		userDevices.prepend(blank);
	}













	function render(src, id, appendTo, data){

		$.get(src, function(htmlArg){

			//Finds and populates template
			var source 		= $(htmlArg).find(id).html();
			var template 	= Handlebars.compile(source);
			var html 		= template(data);


			//Appends template into Wrapper on DOM
			$(appendTo).append(html);


			//Fires a complete event after content has been appended
			$(document).trigger({
				type		: 'rendered',
				template 	: id
			});
		});
	}
















	//loads library from LIbrary menu click for sorting
	// -songs,artists,albums,genres
	function loadFilteredLibrary(sortBy, activeItem){
		var scrollContainer = $('#scroll-container');

		//Show search bar
		$('li.li-header').show();
		$('div.section-header').show();

		scrollContainer.empty();

		sortList(sortBy);

		activeItem(activeItem);

		//Set correct container height
		scrollContainer.css('height', '74vh');

		//Shows ads if coming from acct settings page
		$('#adsense').show();
	}











});//define()
})();//function
