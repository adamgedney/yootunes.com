(function(){
define(['jquery', 'Handlebars', 'getCookies', 'Init', 'User', 'Ui', 'Library'], function($, handlebars, getCookies, Init, User, Ui, Library){






	//private vars
	var _songs 			= [];
	var	_userId			= window.userId;
	var	_userEmail 		= '';
	var _userSongs 		= [];
	var _sortBy			= 'def';
	var _sortOrder		= 'def';
	var _currentContent = '';
	var _baseUrl 		= 'http://yooapi.pw';
	var _thisDevice;
	var _playlistShared = 0;

	var _libraryCount;
	// var _pageLimit;
	// var _lastPageSkip;
	var _currentSkip 	= 0;
	var _numPages;
	var _onPage 		= 1;





	//emitLibraryClick('');
	//NOTE***    need to build socket handler to load on slave what we see on.






		//==============================//
		//PAGINATION handler
		//==============================//
		$(document).on('mouseover', '.resultItems', function(){


			//Determines when to begin loading next result group
			var loadRange 	= [ (20 * _onPage) - 3 + "",
								(20 * _onPage) - 2 + "",
								(20 * _onPage) - 1 + "",
								(20 * _onPage)     + "",
								(20 * _onPage) + 1 + "",
								(20 * _onPage) + 2 + "",
								(20 * _onPage) + 3 + ""];

			var index = $(this).attr('data-index');

				//If we are hovering over the load range we are
				//close enough to load the next group
				if(	index === loadRange[0] ||
				   	index === loadRange[1] ||
				   	index === loadRange[2] ||
				   	index === loadRange[3] ||
				   	index === loadRange[4] ||
				   	index === loadRange[5] ||
				   	index === loadRange[6]
			   	){

						//Only load pages if we haven't reached max results yet
						if((_currentSkip + 50) <= _libraryCount){

							_onPage 		+= 1;
							_currentSkip 	+= 50;

							//Load the next page
							loadLibrary(_currentSkip);
						}//if
				}//if
		});//mouseover li results









		//Acct Settings page load interaction=========//
		$(document).on('click', '#acctSettings', function(event){

			//load account settings page
			loadAcctSettings();

			activeLibraryItem('#acctSettings');

			//Set correct container height
			$('.scroll-container').css('height', '100vh');

		});//click acctSettings












		//Songs library page load interaction=========//
		$(document).on('click', '.viewSongs', function(event){

			var by = "youtube_title";

			resetPagination();

			sortList(by);

			activeLibraryItem('.viewSongs');

			//Set correct container height
			$('.scroll-container').css('height', '74vh');

		});










		//Artists library page load interaction=========//
		$(document).on('click', '.viewArtists', function(event){

			var by = "artist";

			resetPagination();

			sortList(by);

			activeLibraryItem('.viewArtists');

			//Set correct container height
			$('.scroll-container').css('height', '74vh');
		});










		//Albums library page load interaction=========//
		$(document).on('click', '.viewAlbums', function(event){

			var by = "album";

			resetPagination();

			sortList(by);

			activeLibraryItem('.viewAlbums');

			//Set correct container height
			$('.scroll-container').css('height', '74vh');
		});










		//Genres library page load interaction=========//
		$(document).on('click', '.viewGenres', function(event){

			var by = "genre";

			resetPagination();

			sortList(by);

			activeLibraryItem('.viewGenres');

			//Set correct container height
			$('.scroll-container').css('height', '74vh');

		});










		//Playlist page load interaction=========//
		$(document).on('click', '.playlistTitle', function(event){

			//Grabs playlist id for specific loading
			var playlistId = $(this).attr('data-id');

			//Get & load playlist songs
			loadPlaylistSongs(playlistId);

			activeLibraryItem(playlistId);

			//Set correct container height
			$('.scroll-container').css('height', '74vh');
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

			//If no prev search exists, reload
			//library resetting pagination
			if(_songs.length === 0){

				resetPagination();

				//Load library items
				loadLibrary(_currentSkip);

			}else{
				//Send previous results back to renderer
				loadQueryResults(_songs);
			}
		});








		//on reload set shared playlist id for use in app rendered event
		$(document).on('userloggedin', function(event){
			_playlistShared = event.playlistId;

			//window.userId was set in init just before this fired
			_userId = window.userId;

			//Remove share from url
			window.history.pushState({test : ''}, '', "/");


		});









		//Set device on new device creation
		$(document).on('reloadDevices', function(event){

			//Fade out name device modal
			$('#nameDeviceModal').fadeOut();

			//Set this device once a new one is created
			_thisDevice = event.newDeviceId;

		});//on reloadDevices











		//Makes synchronous
		//Listens for loadApp content renderer complete
		$(document).on('rendered', function(event){


			//ON APP RENDER========================//
			if(event.template === '#app'){

				//Set the application THEME colors
				if(window.theme === 'light'){

					Ui.prototype.themeLight();
				}else{

					Ui.prototype.themeDark();
				}



				//DEVICE DETECTION
				//Flow: 1. check device cookies against user devices. If match, set this device
				//		2. If no match, prompt user to name this device
				//		3. if no cookies found, prompt user to select this device from their devices or name this new device
				if(getCookies.devices.length !== 0){
					var devices = getCookies.devices;
					var match = false;

					//DETERMINE WHICH DEVICE COOKIE IS THIS USER'S
					User.getDevices(_userId, function(response){

						for(var i=0;i<response.length;i++){
							for(var j=0;j<devices.length;j++){

								if(response[i].id === devices[j]){

									//THIS IS THE USER'S DEVICE
									_thisDevice 		= devices[j];
									window.thisDevice 	= devices[j];
									match 				= true;

									//Get Devices
									User.getDevices(_userId, function(response){
										renderDevices(response);
									});

									break;
								}//if
							}//for j
						}//for i


						if(match === false){

							//Fade in modal to instruct user to name this device
							$('#nameDeviceModal').fadeIn();
						}//if false
					});//getDevices


				}else{//NO DEVICE COOKIES FOUND


					//Fade in modal to instruct user to name this device
					$('#nameDeviceModal').fadeIn();
					$('#devicePrompt').fadeIn();

					//Maybe user deleted cookies? GET DEVICES TO ASK USER
					User.getDevices(_userId, function(response){

						//List user devices in modal
						for(var k=0;k<response.length;k++){
							var option 	= '<option data-id="' + response[k].id + '">' + response[k].name + '</option>';


							$('#userDevices').append(option);
						}
						//Add a blank device
						var blank	= '<option>Your Devices</option>'
						$('#userDevices').prepend(blank);
					});//getDevices
				}//else





				//if playlistId cookie exists load playlist, else load library
				if(_playlistShared === 0 || _playlistShared === undefined|| _playlistShared === ""){


					//Load library items
					loadLibrary(_currentSkip);


				}else{

					//Adds shared playlist to this user's account
					Library.addSharedPlaylist(_userId, _playlistShared);

					//Load library items
					loadLibrary(_currentSkip);

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

				//Set the application theme colors
				//again to ensure lib items are styled
				//once they hit the DOM
				if(window.theme === 'light'){
					Ui.prototype.themeLight();
				}else{
					Ui.prototype.themeDark();
				}



				//Remove search input value
				$('#searchInput').val('');

				//Set list item length to DOM for shuffle function in player controller
				$('li.resultItems:eq(' + 0 + ')').attr('data-resultLength', _userSongs.length);


				//CHANGE ICON FROM TRASH TO PLUS SIGN============//
				if($('.sourceTitle').html() === 'Add'){

					//Swaps out icon for add icon
					$('li.resultItems').find('.addToLibrary').find('.add-icon').attr('src', 'images/icons/add.png');
				}else{

					$('li.resultItems').find('.addToLibrary').find('.add-icon').attr('src', 'images/icons/trash-icon.svg');
				}


				//Loop through li items to see if song is in library
				for(var i=0;i<_userSongs.length;i++){

					//Sets an index number to each li item
					$('li.resultItems:eq(' + i + ')').attr('data-index', i);

					//Gets the song_id from the displayed result item
					var itemId = $('li.resultItems:eq(' + i + ')').find('.addToLibrary').attr('data-id');

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

				//Check/uncheck theme option based on current setting
				if(window.theme === "dark"){
					$('#themeDark').prop('checked', true);
				}else{
					$('#themeDark').prop('checked', false);
				}

				//Set the application theme colors
				//again to ensure settings items are styled
				//once they hit the DOM
				if(window.theme === 'light'){
					Ui.prototype.themeLight();
				}else{
					Ui.prototype.themeDark();
				}


				//Hide the entire section header (search bar)
				$('.section-header').hide();


				//Get User
				User.getUser(_userId, function(response){

					$('#infoName').val(response[0].display_name);
					$('#infoEmail').val(response[0].email);
					$('#infoId').html(response[0].id);
					$('#infoTitleGender').val(response[0].title);

					//Format birthdate for display
					var birthdate = response[0].birthMonth + '/' + response[0].birthDay + '/' + response[0].birthYear;
					$('#infoBirthdate').val(birthdate);


					//Prepend selected TITLE option
					var option1 = '<option >' + response[0].title + '</option>';
					$('#infoTitleGender').prepend(option1);

						//Handle title options list
						if(response[0].title == "Mr."){
							var option2 = '<option >Mrs.</option>';
							var option3 = '<option >Ms.</option>';
							$('#infoTitleGender').append(option2);
							$('#infoTitleGender').append(option3);
						}else if(response[0].title == "Mrs."){
							var option2 = '<option >Mr.</option>';
							var option3 = '<option >Ms.</option>';
							$('#infoTitleGender').append(option2);
							$('#infoTitleGender').append(option3);
						}else if(response[0].title == "Ms."){
							var option2 = '<option >Mrs.</option>';
							var option3 = '<option >Mr.</option>';
							$('#infoTitleGender').append(option2);
							$('#infoTitleGender').append(option3);
						}
				});//getUser



				//Get Devices
				User.getDevices(_userId, function(response){
					renderDevices(response);
				});

			}//acctSettings
		});//onRendered












		//Reload library when song removed form library
		$(document).on('songremoved', function(){

			//Load library items
			loadLibrary(_currentSkip);
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
			User.getDevices(_userId, function(response){
				renderDevices(response);
			});
		});








//=========================================//
//End event logic
//========================================//






	//public methods & properties.
	var obj = {
		loadLanding 		: loadLanding,
		loadPlaylists		: loadPlaylists,
		loadLibrary 		: loadLibrary,
		loadApp				: loadApp,
		loadReset 			: loadReset,
		loadAcctSettings    : loadAcctSettings
	};





	//return constructor
	return obj;















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

			resetPagination();
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

			//Loads any scripts needing dynamic insertion
			loadScripts();

			resetPagination();

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

			resetPagination();
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

			resetPagination();
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
				$('.li-header').show();

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


					//Reset _userSongs then Store the users songs for list functions
					_userSongs = [];
					for(var i=0;i<response.length; i++){
						_userSongs.push(response[i].song_id);
					}

					//Shows column headers
					$('.li-header').show();

					//Clear append container
					$(appendTo).empty();

					//Render library items with user data
					render(src, id, appendTo, data);

					resetPagination();


					//Change last column to remove
					$('.sourceTitle').html('Remove');

				}//success
			});//ajax
	}












	//Gets data & Loads library template
	function loadLibrary(page){

		//Ensures userId is always available
		if(_userId === undefined){
			if(window.userId !== undefined){
				_userId = window.userId;
			}else if(getCookies.userId !== undefined){
				_userId = getCookies.userId;
			}
		}



		//Ensures search bar is visible & container is
		//emptied quickly before a reload
		if(page === 0){
			$('.section-header').show();
			$('.scroll-container').empty();

			//Shows column headers
			$('.li-header').show();

			//Change last column to remove
			$('.sourceTitle').html('Remove');
		}


		var src 		= '/js/views/library.html',
			id 			= '#libraryItem',
			appendTo 	= '.scroll-container';

			//Build API request
			var API_URL = _baseUrl + '/get-library/' + _userId + '/' + _sortBy + '/' + _sortOrder + '/' + page;



			//Call API for user's library
			$.ajax({
				url 		: API_URL,
				method 		: 'GET',
				dataType 	: 'json',
				success 	: function(response){

					data 	 	= {
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


					//Pagination vars
					_libraryCount 	= response.count;

					//Set the number of pages available to pagination
					_numPages = Math.ceil(response.count / response.limit);

					//Display total songs in library in interface
					$('#collectionTotal').html(response.count);




					//Store the users songs for list functions
					for(var i=0;i<response[0].length; i++){
						_userSongs.push(response[0][i].song_id);
					}



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

			//Clear append container
			$(appendTo).empty();

		render(src, id, appendTo, data);

			resetPagination();

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

			//Clear append container
			$(appendTo).empty();


		render(src, id, appendTo, data);


			resetPagination();


		//Change last column to remove
		$('.sourceTitle').html('Add');
	}













	//Maintains list of DOM nodes to hide on app init
	function hideNodes(){

		var selectors = ['.playlist-dropdown', 'li.main-dropdown',
		 '.improve-meta-sub-menu', '.signin',
		'#restoreAcctModal', '.newPlaylistForm'];

		for(var i=0; i<selectors.length;i++){
			$(selectors[i]).hide();
		}
	}














	function renderDevices(response){
		$('#play-on').empty();
		$('#infoDeviceList').empty();


		//Loop through device list
		for(var j=0;j<response.length;j++){

			//===================================//
			//Settings page & app footer list
			//===================================//
			//If device is this device, set name
			if(response[j].id === _thisDevice){

				//Set the current device if it matches the cookie
				$('.infoDeviceName').val(response[j].name);
				$('.infoDeviceName').attr('data-id', response[j].id);

				//set footer list items first result to the current device
				var option = '<option data-id="' + response[j].id + '">' + response[j].name + '</option>';
				$('#play-on').prepend(option);



			}else{



				//Populate SETTINGS PAGE list
				var li = '<li>' + response[j].name + ' <img id="deleteDevice" data-id="' + response[j].id + '" src="images/icons/trash-icon.svg"/></li>';
				$('#infoDeviceList').append(li);



				//Populate APP FOOTER list
				var option = '<option data-id="' + response[j].id + '">' + response[j].name + '</option>';
				$('#play-on').append(option);

			}//else
		}//for
	}














	function render(src, id, appendTo, data){

		$.get(src, function(htmlArg){

			//Finds and populates template
			var source 		= $(htmlArg).find(id).html();
			var template 	= Handlebars.compile(source);
			var html 		= template(data);


			//Clear append container
			// $(appendTo).empty();

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
			loadLibrary(_currentSkip);

			this.toggle = !this.toggle;

		}else{
			//Set the sort order
			_sortBy 	= by;
			_sortOrder 	= "ASC";

			//Load library
			loadLibrary(_currentSkip);

			this.toggle = !this.toggle;
		}
	}







	//Resets PAGINATION variables for transitioning
	//back to library fom another screen
	function resetPagination(){
		_currentSkip 	= 0;
		_onPage 		= 1;
		_userSongs 		= [];
	}








	function activeLibraryItem(active){

		var songs 		= '.viewSongs';
		var artists 	= '.viewArtists';
		var albums 		= '.viewAlbums';
		var genres 		= '.viewGenres';
		var settings 	= '#acctSettings';
		var playlists 	= '.playlistTitle';

			if(active === songs){
				$(songs).find('a').addClass('red');
				$(songs).addClass('red');

				$(artists).removeClass('red');
				$(albums).removeClass('red');
				$(genres).removeClass('red');
				$(artists).find('a').removeClass('red');
				$(albums).find('a').removeClass('red');
				$(genres).find('a').removeClass('red');
				$(settings).find('a').removeClass('red');
				$(playlists).removeClass('red');

			}else if(active === artists){
				$(artists).find('a').addClass('red');
				$(artists).addClass('red');

				$(songs).removeClass('red');
				$(albums).removeClass('red');
				$(genres).removeClass('red');
				$(songs).find('a').removeClass('red');
				$(albums).find('a').removeClass('red');
				$(genres).find('a').removeClass('red');
				$(settings).find('a').removeClass('red');
				$(playlists).removeClass('red');

			}else if(active === albums){
				$(albums).find('a').addClass('red');
				$(albums).addClass('red');

				$(artists).removeClass('red');
				$(songs).removeClass('red');
				$(genres).removeClass('red');
				$(songs).find('a').removeClass('red');
				$(artists).find('a').removeClass('red');
				$(genres).find('a').removeClass('red');
				$(settings).find('a').removeClass('red');
				$(playlists).removeClass('red');

			}else if(active === genres){
				$(genres).find('a').addClass('red');
				$(genres).addClass('red');

				$(artists).removeClass('red');
				$(albums).removeClass('red');
				$(songs).removeClass('red');
				$(songs).find('a').removeClass('red');
				$(artists).find('a').removeClass('red');
				$(albums).find('a').removeClass('red');
				$(settings).find('a').removeClass('red');
				$(playlists).removeClass('red');

			}else if(active === settings){
				$(settings).find('a').addClass('red');

				$(artists).removeClass('red');
				$(albums).removeClass('red');
				$(songs).removeClass('red');
				$(genres).removeClass('red');
				$(songs).find('a').removeClass('red');
				$(artists).find('a').removeClass('red');
				$(albums).find('a').removeClass('red');
				$(genres).find('a').removeClass('red');
				$(playlists).removeClass('red');

			}else{//if active is a playlist id
				$(playlists).removeClass('red');
				$(playlists + '[data-id=' + active + ']').addClass('red');

				$(artists).removeClass('red');
				$(albums).removeClass('red');
				$(songs).removeClass('red');
				$(genres).removeClass('red');
				$(songs).find('a').removeClass('red');
				$(artists).find('a').removeClass('red');
				$(albums).find('a').removeClass('red');
				$(genres).find('a').removeClass('red');
				$(settings).find('a').removeClass('red');
			}
	}





















});//define()
})();//function
