(function(){
define(['jquery', 'Handlebars', 'getCookies', 'sortContent', 'getUserDevices','Init', 'User', 'Ui', 'Library'],
	function($, handlebars, getCookies, sortContent, getUserDevices, Init, User, Ui, Library){




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












		//Acct Settings page load interaction=========//
		$(document).on('click', '#acctSettings', function(event){

			//load account settings page
			loadAcctSettings();

			window.state 	= 'settings';


			activeLibraryItem('#acctSettings');

			//Set correct container height
			$('#scroll-container').css('height', '100vh');

		});//click acctSettings













		//Playlist page load interaction=========//
		$(document).on('click', '.playlistTitle', function(event){

			//Grabs playlist id for specific loading
			var playlistId = $(this).attr('data-id');

			//Get & load playlist songs
			loadPlaylistSongs(playlistId);

			activeLibraryItem(playlistId);

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

						datalist.append('<li>Search History</li><li></li>');

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









		// //Set device on new device creation
		// $(document).on('reloadDevices', function(event){


		// 	//Set this device once a new one is created
		// 	_thisDevice = event.thisDevice;

		// 	//Load devices
		// 	getUserDevices.get(_userId, function(response){
		// 		renderDevices(response);
		// 	});

		// });//on reloadDevices








		//Reload devices in slave mode to prevent glitched controlling
		$(document).on('slaveMode', function(){

			console.log("slave mode content cont");
			getUserDevices.get(_userId, function(response){

				renderDevices(response);
			});//getDevices

		});











		//Makes synchronous
		//Listens for loadApp content renderer complete
		$(document).on('rendered', function(event){


			//ON APP RENDER========================//
			if(event.template === '#app'){

				//Show adsense ads on app load
				$('#adsense').show();
				// DOM.video.show();



				//Ensures userId is always available
				if(_userId === undefined || !_userId || _userId === '' || _userId === null){
					if(window.userId !== undefined){
						_userId = window.userId;
					}else if(getCookies.userId !== undefined){
						_userId = getCookies.userId;
					}
				}


				// //Failsafe retrieval of theme
				// if(window.theme === undefined){
				// 	window.theme = getCookies.theme;
				// }

				// //Set the application THEME colors
				// if(window.theme === 'light'){

				// 	Ui.themeLight();
				// }else{

				// 	Ui.themeDark();
				// }



				//Render devices once init has retrieved them
				$(document).on('renderdevices', function(event){

					//Set this device once a new one is created
					if(event.thisDevice){
						_thisDevice = event.thisDevice;
					}

					//Render devices
					if(event.response){
						renderDevices(event.response);
					}else{
						//Fetch as render user devices in lists and modals
						getUserDevices.get(_userId, function(response){
							renderDevices(response);
						});
					}
				});//renderdevices


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

					$('span.li-col7').show();
					$('span.li-col2').css({'width':'41.6666666%'});//4 col

					//Swaps out icon for add icon
					resultItems.find('span.addToLibrary').find('img.add-icon').attr('src', 'images/icons/add.png');
				}else{

					$('.li-col7').hide();
					$('.li-col2').css({'width':'50%'});//5 col

					resultItems.find('span.addToLibrary').find('img.add-icon').attr('src', 'images/icons/trash-icon.svg');
				}


				//Loop through li items to see if song is in library
				for(var i=0;i<_userSongs.length;i++){

					//Sets an index number to each li item
					libraryWrapper.find('li.resultItems:eq(' + i + ')').attr('data-index', i);

					//Gets the song_id from the displayed result item
					var itemId = libraryWrapper.find('li.resultItems:eq(' + i + ')').find('span.addToLibrary').attr('data-id');

//**NOTE			//Should load the library here w/out a limit to get an array of song ids.
					//if song id matches this song, then add the check mark icon instead

				}//for

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
					renderDevices(response);
				});

			}//acctSettings
		});//onRendered













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
	function loadApp(){
		var src 		= '/js/views/app.html',
			id 			= '#app',
			appendTo 	= '#wrapper';

			data 	 	= {
				test	: ''
			};

			//Clear append container
			$(appendTo).empty();


		render(src, id, appendTo, data);
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

					// console.log("pulled lib from local storage");

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

					// console.log("rewrote local storage");
				}

				_libraryChanged = false;
				//compare localStorage to library?


				//Add a loading screen here that's removed once library is rendered

			}//success
		});//ajax
	}











	//Used by loadLibrary method
	function prepareLibrary(response){

		var src 		= '/js/views/library.html',
			id 			= '#libraryItem',
			appendTo 	= '#scroll-container';


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

		var selectors = ['.playlist-dropdown', 'li.main-dropdown',
		 '.improve-meta-sub-menu', '.signin','#restoreAcctModal',
		 '.newPlaylistForm', '#signupContainer','#hiddenCreatePlaylistForm',
		 '#minimizeOverlay'];

		for(var i=0; i<selectors.length;i++){
			$(selectors[i]).hide();
		}
	}














	function renderDevices(response){
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

			//If device is this device, set name
			if(response[j].id === _thisDevice){

				//Set ACCOUNT SETTINGS current device if it matches the cookie
				deviceName.val(response[j].name);
				deviceName.attr('data-id', response[j].id);
				var li = '<li>' + response[j].name + ' <img id="deleteDevice" data-id="' + response[j].id + '" src="images/icons/trash-icon.svg"/></li>';
				deviceList.append(li);

				//set FOOTER list items first result to the current device
				var option = '<option data-id="' + response[j].id + '">' + response[j].name + '</option>';
				playOn.prepend(option);
				mobilePlayOn.prepend(option);

			}else{

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

			}//else
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

		activeLibraryItem(activeItem);

		//Set correct container height
		scrollContainer.css('height', '74vh');

		//Shows ads if coming from acct settings page
		$('#adsense').show();
	}








	function activeLibraryItem(active){

		var songs 		= $('li.viewSongs');
		var artists 	= $('li.viewArtists');
		var albums 		= $('li.viewAlbums');
		var genres 		= $('li.viewGenres');
		var settings 	= $('li#acctSettings');
		var playlists 	= $('a.playlistTitle');

		var songsA 		= songs.find('a');
		var artistsA	= artists.find('a');
		var albumsA 	= albums.find('a');
		var genresA 	= genres.find('a');
		var settingsA 	= settings.find('a');


			if(active === songs){
				songsA.addClass('red');
				songs.addClass('red');

				artists.removeClass('red');
				albums.removeClass('red');
				genres.removeClass('red');
				artistsA.removeClass('red');
				albumsA.removeClass('red');
				genresA.removeClass('red');
				settingsA.removeClass('red');
				playlists.removeClass('red');

			}else if(active === artists){
				artistsA.addClass('red');
				artists.addClass('red');

				songs.removeClass('red');
				albums.removeClass('red');
				genres.removeClass('red');
				songsA.removeClass('red');
				albumsA.removeClass('red');
				genresA.removeClass('red');
				settingsA.removeClass('red');
				playlists.removeClass('red');

			}else if(active === albums){
				albumsA.addClass('red');
				albums.addClass('red');

				artists.removeClass('red');
				songs.removeClass('red');
				genres.removeClass('red');
				songsA.removeClass('red');
				artistsA.removeClass('red');
				genresA.removeClass('red');
				settingsA.removeClass('red');
				playlists.removeClass('red');

			}else if(active === genres){
				genresA.addClass('red');
				genres.addClass('red');

				artists.removeClass('red');
				albums.removeClass('red');
				songs.removeClass('red');
				songsA.removeClass('red');
				artistsA.removeClass('red');
				albumsA.removeClass('red');
				settingsA.removeClass('red');
				playlists.removeClass('red');

			}else if(active === settings){
				settingsA.addClass('red');

				artists.removeClass('red');
				albums.removeClass('red');
				songs.removeClass('red');
				genres.removeClass('red');
				songsA.removeClass('red');
				artistsA.removeClass('red');
				albumsA.removeClass('red');
				genresA.removeClass('red');
				playlists.removeClass('red');

			}else{//if active is a playlist id
				playlists.removeClass('red');
				$('a.playlistTitle[data-id=' + active + ']').addClass('red');

				artists.removeClass('red');
				albums.removeClass('red');
				songs.removeClass('red');
				genres.removeClass('red');
				songsA.removeClass('red');
				artistsA.removeClass('red');
				albumsA.removeClass('red');
				genresA.removeClass('red');
				settingsA.removeClass('red');
			}
	}








});//define()
})();//function
