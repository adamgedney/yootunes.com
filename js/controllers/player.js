(function(){
define(['jquery', 'getCookies', 'determineDevice', 'js/services/slider.js', 'logging', 'videoSizer', 'socketService', 'renderSongInfo'],
	function($, getCookies, determineDevice, slider, logging, videoSizer, socketService, renderSongInfo){


	//private vars
	var _baseUrl 			= 'http://api.atomplayer.com';
	var PLAYER			= {};

	var _playerPlaying      = false;
	var	_playerNewVideo		= true;
	// var window.updateInterval;

	// var _seek 				= {};
	// 	_seek.scrubber		= '#seek-dot',
	// 	_seek.seekPos 		= 0,
	// 	_seek.duration 		= 0,
	// 	_dragging 			= false;

	var _resultLength 		= 0;
	var _currentIndex 		= 0;
	var _shuffleIndexes 	= [];
	var _prevIndex 			= 0;
	var _playingVideo     	= '';
	var _paused 			= false;

	var _playMode 			= {};
		_playMode.loop 		= false;
		_playMode.shuffle 	= false;
		_playMode.slave 	= false;

	var _socketConnect 		= socketService.socket;
	var _socket 			= null;


	var _thisDevice;
	var _playOnDevice;//default
	var _mobileTriggerDevice;
	var _userId 			=  '';
	var _lastPlaylist;

	var _data;

	var app_break_smmd 		= '800';
	var _mobileIframeId;





	//constructor method
	var player = function(){




		//Ensures private vars won't be set until ready
		$(document).on('gotdevices', function(event){

			//Retrieve cookies & set device & userId
			var userCookies = getCookies;

			_thisDevice 	= event.thisDevice;
			_playOnDevice 	= event.thisDevice;//default device
			_userId 		= userCookies.userId;


			console.log(_thisDevice, "player device", event, window.thisDevice);

		});




		//If a reload was picked up from conten.js app rendered
		//_thisDevice needs to be set for the first time
		$(document).on('reloadDevices', function(event){

			//Set this device once a new one is created
			_thisDevice = event.newDeviceId;
		});



		//on playOn change, pause video to enable transition
		$(document).on('change', '#play-on', function(){

			_playOnDevice =  $('select#play-on option:selected').attr('data-id');

				pause();
		});



		$(document).on('change', '#mobile-play-on', function(){

			var liCol1 			= $('span.li-col1');
			var liCol2 			= $('span.li-col2');
			var footer 			= $('div.footer');
			var videoOverlay 	= $('#video-overlay');
			_playOnDevice 		=  $('select#mobile-play-on option:selected').attr('data-id');

				pause();

				$('div.video-size-ctrl').hide();
				$('#video').hide();

			if(window.thisDevice !== _playOnDevice){
				liCol1.hide();
				liCol2.css('width', '83.3333333%');
				videoOverlay.hide();

				footer.show();

			}else{
				liCol1.show();
				liCol2.css('width', '75%');
				videoOverlay.show();

				footer.hide();
			}
		});




		//========================================//
		//Listen for RENDERED
		//========================================//
		$(document).on('rendered', function(event){

			if(event.template === '#app'){

				var video 			= $('#video');
				var videoSizeCtrls 	= $('div.video-size-ctrl');
				var footer 			= $('div.footer');

				//Hide footer for mobile devices until playOn change
				if(window.windowWidth < app_break_smmd){
					video.hide();
					videoSizeCtrls.hide();
					footer.hide();

				}else{
					video.show();
					videoSizeCtrls.show();
					footer.show();
				}

				//Start loading the player script once #video is on DOM
				loadPlayerScript();

				ensureUserExists();

				//Join user to his room for playOn control
				socketService.joinRoom(_userId);

				//Ensure shuffle icon is visible if previously hidden by playOn mode
				$('img#shuffleResults').css('opacity','1');
			}


			//When libary items have loaded
			if(event.template === '#libraryItem'){

				//added as a failsafe
				// determineDevice();

				//When list is loaded, if list item video is playing, set icon to pause
				$('img.playIconImg[data-videoid=' + _playingVideo + ']').attr('src', 'images/icons/pause-drk.png');

				//Populate footer metadata with first li item data
				if(_playerPlaying === false &&  _paused === false){
					var libraryWrapper 	= $('#libraryWrapper');
					var id = libraryWrapper.find('li.resultItems:eq(' + 0 + ')').find('img.playIconImg').attr('data-videoId');

					//Change li text color of the playing item
					libraryWrapper.find('li.resultItems[data-videoId=' + id + ']').find('span.li-col2, span.li-col3, span.li-col4, span.li-col5, span.li-col6').addClass('red');//red

					renderSongInfo(id);
				}


			};//#libraryItem
		});//on rendered










		$(document).on('click', '#loopSong', function(event){


			if(!_playMode.loop){

				_playMode.loop = !_playMode.loop;

				//Reset shuffle button and boolean val
				_playMode.shuffle 	= false;
				$('img#shuffleResults').attr('src', 'images/icons/shuffle-icon.png');

				//Change icon to indicate selection
				$(this).attr('src', 'images/icons/loop-icon-red.png');
			}else{

				_playMode.loop = !_playMode.loop;


				$(this).attr('src', 'images/icons/loop-icon.png');
			}

		});









		$(document).on('click', '#shuffleResults', function(event){

			//Only allow shuffle mode when not in playOn mode
			if(_socket === null){

				//Ensure shuffle icon is visible
				$('img#shuffleResults').css('opacity','1');

				if(!_playMode.shuffle){

					_playMode.shuffle 	= !_playMode.shuffle;

					//Reset loop button and boolean val
					_playMode.loop 		= false;
					$('img#loopSong').attr('src', 'images/icons/loop-icon.png');

					//Change icon to indicate selection
					$(this).attr('src', 'images/icons/shuffle-icon-red.png');

				}else{

					_playMode.shuffle = !_playMode.shuffle;

					//Change oicon back
					$(this).attr('src', 'images/icons/shuffle-icon.png');
				}

			}
		});









		//Prev/Next Click Handler=======//
		$(document).on('click', '#prev-btn', function(){
			var libraryWrapper 	= $('#libraryWrapper');

			//If shuffle is enabled, load a new random song
			if(_playMode.shuffle){


				_prevIndex -= 1 ;

				//Gets index number of previous shuffle videos stored in shuffleIndex array
		    	var prevVideo = libraryWrapper.find('li.resultItems[data-index="' + _shuffleIndexes[_prevIndex + _shuffleIndexes.length] + '"]').attr('data-videoId');

				//Start playing
				// PLAYER.loadVideoById(prevVideo);

				play(prevVideo);


			}else{//Normal prev button behavior

				//set current index
				_currentIndex = parseInt(_currentIndex, 10) - 1;

		    	var prevVideo = libraryWrapper.find('li.resultItems[data-index="' + _currentIndex + '"]').attr('data-videoId');

				//Start playing
				// PLAYER.loadVideoById(prevVideo);

				play(prevVideo);
			}



		});


		//Next btn  Click Handler=======//
		$(document).on('click', '#next-btn', function(){
			var libraryWrapper 	= $('#libraryWrapper');

			//If shuffle is enabled, load a new random song
			if(_playMode.shuffle){

				playRandom();


			}else{//Normal next button behavior

				//set current index
				_currentIndex = parseInt(_currentIndex, 10) + 1;

		    	var nextVideo = libraryWrapper.find('li.resultItems[data-index="' + _currentIndex + '"]').attr('data-videoId');

				//Start playing
				// PLAYER.loadVideoById(nextVideo);

				play(nextVideo);
			}
		});













			//Listens for the player API to load
			window.onYouTubePlayerAPIReady = function() {

				// create the global player from the specific iframe (#video)
				PLAYER = new YT.Player('video', {
					playerVars: {
						controls 		: 0,
						enablejsapi 	: 1,
						rel 			: 0,
						showinfo		: 0,
						modestbranding 	: 1,
						origin 			: 'http://yootunes.com'
					},
				    events: {
				      // call this function when player is ready to use
				      'onStateChange'	: onPlayerStateChange,
				      'onReady'			: onPlayerReady
				    }
			  });
			}


			//Fires when player returns ready
			window.onPlayerReady = function(event) {

				//FOOTER PLAY BUTTON Click Handler=======//
				$(document).on('click', '#play-btn', function(){
					var libraryWrapper 	= $('#libraryWrapper');

					var youtubeId = libraryWrapper.find('li.resultItems:eq(' + 0 + ')').find('.playIconImg').attr('data-videoId');

						//Play if not already playing
						if(_playerPlaying === false){

							play(youtubeId);

							_playerPlaying 	= true;
							_paused 		= false;

						//Stop playing if already playing
						}else{

							pause();

							_paused 		= true;
							_playerPlaying 	= false;
						}
				});



				//===================================//
				//Volume Handler
				//===================================//
				var prevVolume;

				$(document).on('mousemove', '#volumeRange', function(){

					var rangeVolume = $('#volumeRange').val();

					//No need for sockets if this is the device we're playing on
					if(_socket === null){

						//set volume normally
						PLAYER.setVolume(rangeVolume);


					}else{//PlayOn

						//Be sure loacl volume is still muted
						PLAYER.mute();


						//Build obj for socket transmission
						var data = {
							'device' 			: _playOnDevice,
							'volume' 			: rangeVolume,
							'controllerDevice' 	: _thisDevice,
							'userId' 			: _userId
						}


						//=============================//
						//Socket EMIT volume stream
						//=============================//
						if(rangeVolume !== prevVolume){

							_socketConnect.emit('volume', data);

							prevVolume = rangeVolume;
						}

					}//else
				});//volume mousemove


			//================================//
			};//On Player Ready
			//================================//









			//===========================================//
			//Listens for PLAYER API STATE CHANGE message
			//===========================================//
			window.onPlayerStateChange = function(event){

				var libraryWrapper 	= $('#libraryWrapper');
				var id = PLAYER.getVideoData().video_id;


				//================================//
				//Playing code
				//================================//
				if (event.data === 1){


					//Set song data & UI Changes
					renderSongInfo(id);
					var playing = $('span.play-icon[data-videoId=' + id + ']');


					//Resets video ctrl container to opaque (hides loading icon)
					$('div.video-size-ctrl').css({'opacity':'1'});

					//Dynamically add video url to watch on icon in video ctrl box
					$('a#watchOnYoutube').attr('href', 'http://youtube.com/watch?v=' + id);

					//NOTE:*****
					//This is actually the current index. Clean up possible duplicate setting of this value later.
					//This is the ideal place to set current index
					_currentIndex = playing.parent().attr('data-index');


					//Set playing variable for use by the onrendered event
					_playingVideo = id;

					//Calls runUpdate() on regular intervals
					window.updateInterval = setInterval(runUpdate, 100);


			      	//If user plays video from click on video, change play/pause in desktop view only
			      	if(window.windowWidth > app_break_smmd){
			      		$('div.transport-ctrl img#play-btn').attr('src', 'images/icons/pause.png');
			      	}




			      	//Sets resultItems play/pause img
					$('span.li-col1 img.playIconImg').attr('src', 'images/icons/play-drk.png');
					$('img.playIconImg[data-videoid=' + id + ']').attr('src', 'images/icons/pause-drk.png');


					//Change li text color of the playing item
					libraryWrapper.find('li.resultItems').find('span.li-col2, span.li-col3, span.li-col4, span.li-col5, span.li-col6').removeClass('red');//red
					libraryWrapper.find('li.resultItems[data-videoId=' + id + ']').find('span.li-col2, span.li-col3, span.li-col4, span.li-col5, span.li-col6').addClass('red');//red



				//================================//
				//Paused code
				//================================//
			    }else if(event.data < 1){



			    	//Clears above update interval
			    	clearInterval(window.updateInterval);

			    	//If user plays video from click on video, change play/pause
			    	if(window.windowWidth > app_break_smmd){
			      		$('div.transport-ctrl img#play-btn').attr('src', 'images/icons/play-wht.png');
			      	}


			    	//Sets list icon play/pause img
			    	$('img.playIconImg[data-videoid=' + id + ']').attr('src', 'images/icons/play-drk.png');

			    }




			    //================================//
			    //If video has ended
			    //================================//
			    if(event.data === 0){//video ended

			    	//======================//
			    	//If loop is enabled
			    	//======================//
			    	if(_playMode.loop){

			    		//Start playing same video again
						// PLAYER.loadVideoById(id);

						play(id);



					//======================//
					//if shuffle enabled
					//======================//
			    	}else if(_playMode.shuffle){

			    		playRandom();



					//======================//
					//Autoplay
					//======================//
			    	}else{

			    		//Handles autoplaying next video
				    	//set current index converted from string to int
						_currentIndex = parseInt(_currentIndex, 10) + 1;

				    	var nextVideo = libraryWrapper.find('li.resultItems[data-index="' + _currentIndex + '"]').attr('data-videoId');

						//Start playing
						// PLAYER.loadVideoById(currentVideo);
						console.log(nextVideo, "autoplay");
						play(nextVideo);


			    	}
			    }
			};//onStateChange








		//Play icon Click Handler=======//
		$(document).on('click', '.play-icon', function(event){

			// var libraryWrapper 	= $('#libraryWrapper');
			var id = $(this).attr('data-id');

			playItem($(this));

		});//onclick play icon









			$(document).on('click', '.dropdown-trigger', function(event){
				// console.log(window.windowWidth);
				//Mobile view song play on li click

				if(window.windowWidth < app_break_smmd){

					var item = $(this).parent().find('span.play-icon');
					playItem(item);

				}

			});//onclick play icon








		//Mute/unmute on volume icon click
		$(document).on('click', '.vol-icon', function(event){

			if($(this).attr('src') === 'images/icons/volume-icon.svg'){

				//mute player
				PLAYER.mute();

				//Set icon to muted icon
				$(this).attr('src', 'images/icons/volume-icon-mute.svg');

			}else{

				//unmute player
				PLAYER.unMute();

				//Set icon back to non muted icon
				$(this).attr('src', 'images/icons/volume-icon.svg');
			}


		});







		//Pause video when user clicks watch on youtube link in video cntrls
		$(document).on('click', '#watchOnYoutube', function(){
			pause();
		});










		//Event fired by slider service to set the player seek time
		$(document).on('seekto', function(event){

			seekTo(event.scrubPos);
		});











		// _socketConnect.on('*', function (response) {
		// 	console.log("catchall",response);
		// 				});


		//=============================//
		//Listen for socket ON PLAY
		//=============================//
		_socketConnect.on('playOn', function (response) {

			_playMode.slave = true;

			//Set thisDevice from content controller's determination
			_thisDevice = window.thisDevice;

			_mobileTriggerDevice = response.controllerDevice;

			if(_thisDevice === response.device){

				videoSizer.fullView();

				console.log("socket play return event received thisDev/response", _thisDevice, response);

				//Hide the shuffle icon ** may need to display none it
				$('img#shuffleResults').css('opacity','0');


					//Check to see if this is a new video
					if(response.newVideo === "false"){

						//unmute the controller
						PLAYER.unMute();

						//Set icon to unmuted icon
						$('div.volume-ctrl img.vol-icon').attr('src', 'images/icons/volume-icon.svg');

						PLAYER.playVideo();
						// var id = PLAYER.getVideoData().video_id;

						//Updates button ui
						$('div.transport-ctrl img#play-btn').attr('src', 'images/icons/pause.png');

						_playerPlaying= !_playerPlaying;

					}else{
						//unmute the controller
						PLAYER.unMute();

						//Set icon to unmuted icon
						$('div.volume-ctrl img.vol-icon').attr('src', 'images/icons/volume-icon.svg');

						PLAYER.loadVideoById(response.youtubeId);
					}//else
			}//if _thisDevice
		});//_socketConnect.on









		//=============================//
		//Listen for socket ON PAUSE
		//=============================//
		_socketConnect.on('pauseOn', function(response){

			_playMode.slave = true;

			if(_thisDevice === response.device){
				PLAYER.stopVideo();


				videoSizer.minView();


				//Updates button ui
				$('div.transport-ctrl img#play-btn').attr('src', 'images/icons/play-wht.png');

				_playerPlaying = !_playerPlaying;
			}

		});//_socketConnect.on









		//=============================//
		//Listen for socket ON VOLUME
		//=============================//
		_socketConnect.on('volumeOn', function(response){

			_playMode.slave = true;

			if(_thisDevice === response.device){
				//set volume
				PLAYER.setVolume(response.volume);

				//Set the range slider value to match assigned value
				$('#volumeRange').val(response.volume);
			}
		});//_socketConnect.on










		//=============================//
		//Listen for socket ON SETTIME
		//=============================//
		_socketConnect.on('seekToOn', function(response){
			_playMode.slave = true;

			var seekBar = $('#seek-bar');

			if(_thisDevice === response.device){
				//Set playing video's position
				PLAYER.seekTo(response.seconds, true);


				_seek.seekPos = ((seekBar.width() / _seek.duration) * response.seconds)  + seekBar.offset().left;

				$('#seek-dot').offset({left: _seek.seekPos});
			}

		});//_socketConnect.on






















	};//constructor
	//=========================//

	//methods and properties.
	player.prototype 	= {
		constructor  	: player,
		play 		 	: play,
		pause 		 	: pause,
		playItem 		: playItem
	};

	//return constructor
	return player;









//================================//
//Class methods===================//
//================================//



	function runUpdate(){
		var duration 		= PLAYER.getDuration();
		var currentTime 	= PLAYER.getCurrentTime();
		var loadedFraction 	= PLAYER.getVideoLoadedFraction();

		slider.updateTime(duration, currentTime, loadedFraction)
	}



	function seekTo(scrubberOffset){

		var seekBar = $('#seek-bar');
		var duration = PLAYER.getDuration();

		//Set video time: ((scrubber x - bar left) / bar width) * duration
		var s = ((scrubberOffset - seekBar.offset().left) / seekBar.width()) * duration;


		//Build obj for socket transmission
		var data = {
			'device' 			: _playOnDevice,
			'controllerDevice' 	: _thisDevice,
			'userId' 			: _userId,
			'seconds' 			: s
		}


		if(_socket === 'open'){

			//EMIT seekTo event back to server
			_socketConnect.emit('seekTo', data);
		}


		//seekTo normally
		PLAYER.seekTo(s, true);
	}












	function playItem(that){

		var playerId;
		var id = that.attr('data-videoid');



		if(window.windowWidth < app_break_smmd){
			playerId = _mobileIframeId;
		}else{
			playerId = PLAYER.getVideoData().video_id;
		}


		renderSongInfo(id);

		//Makes video ctrl transparent so user can see youtube loading gif
		$('div.video-size-ctrl').css({'opacity':'.5'});

		//Sets the current index to enable autoplay feature funcitonality
		_currentIndex = that.parent().attr('data-index');

		this.newVideo;

		//Checks to see if loaded video matches this video
		if(playerId !== id){
			this.newVideo = true;
		}else{
			this.newVideo = false;
		}


			//Determines if new video needs to be loaded
			if(this.newVideo === true){

				_paused = false;

				play(id);


				//sets new video to false & playing to true
				this.newVideo 	= false;

				// _playerNewVideo = !_playerNewVideo;

				_playerPlaying = true;



			//Runs play w/out loading new video
			}else{


				//Pause playback handler
				if(_playerPlaying){
					//Pause playback
					pause();

					_paused 		= true;
					_playerPlaying	= false;


				}else{


					play(id);

					//sets playing to true
					_playerPlaying  = true;
					_paused 		= false;
				}//else
			}//else
	}















	function play(youtubeId){

		ensureUserExists();


		//Fallback thisDevice for mobile slips
		_thisDevice 		= window.thisDevice;
		var volumeIcon 		= $('div.volume-ctrl img.vol-icon');
		var transportPlay 	= $('div.transport-ctrl #play-btn');
		var playingSongId 	= $('span.play-icon[data-videoId=' + youtubeId + ']').attr('data-id');

		if(window.windowWidth < app_break_smmd){
			_playOnDevice =  $('#mobile-play-on option:selected').attr('data-id');
			_mobileIframeId = youtubeId;

		}else{
			_playOnDevice =  $('#play-on option:selected').attr('data-id');
		}

		// //Necessary for decoupled scrubber
		// window.playOnDevice = _playOnDevice;

		//Build obj for socket transmission
		_data = {
			'userId'			: _userId,
			'device' 			: _playOnDevice,
			'youtubeId' 		: youtubeId,
			'newVideo'  		: 'false',
			'controllerDevice' 	: _thisDevice
		}


		//Connection to socketserver runs if we choose to be a controller
		if(_thisDevice !== _playOnDevice){
			_socket = 'open';

			//Mute this controller device
			PLAYER.mute();

			//Set icon to muted icon
			volumeIcon.attr('src', 'images/icons/volume-icon-mute.svg');

			//Hide the shuffle icon ** may need to display none it
			$('#shuffleResults').css('opacity','0');


		}else{
			_socket = null;

			//unmute the controller
			PLAYER.unMute();

			//Set icon to unmuted icon
			volumeIcon.attr('src', 'images/icons/volume-icon.svg');

			//Show the shuffle icon ** may need to display none it
			$('#shuffleResults').css('opacity','1');
		}


		//Signifies we're in play/pause loop
		if(_paused === true){

			//Only emit events on playOn device selection
			if(_socket === 'open'){
				//Change data.newVideo accordingly
				_data.newVideo = 'false';

				//EMIT event back to server
				_socketConnect.emit('play', _data);

				//Delay play by 1s to wait for socket connection to load slave video
				// setTimeout(, 1000);

				PLAYER.playVideo()


			}else if(_socket === null){
				//Play Local video normally w/out delay

				PLAYER.playVideo();



			}//if

				//Updates button ui
				transportPlay.attr('src', 'images/icons/pause.png');

				_playerPlaying= !_playerPlaying;




		}else{//New Video


			//Only emit events on playOn device selection
			if(_socket === 'open'){
				//Change data.newVideo accordingly
				_data.newVideo = 'true';

				//EMIT event back to server
				_socketConnect.emit('play', _data);

				//Delay play by 2s to wait for socket connection to load slave video
				// setTimeout(, 2000);


				//Play local video
				PLAYER.loadVideoById(youtubeId);



			}else if(_socket === null){
				//Play local video
				if(window.windowWidth < app_break_smmd){
					popupPlayer(youtubeId);

				}else{
					PLAYER.loadVideoById(youtubeId);
				}

			}//if

				//reset seek stepper for each new video
				//to conrol seek bar fill
				// _seek.stepper = 0;

				//Updates button ui
				transportPlay.attr('src', 'images/icons/pause.png');

				//Log the song being played
				logging.logPlay(playingSongId, _lastPlaylist);
		}//else bew video


	}//play

















	function pause(){

		//Clear update interval here to prevent Safari glitch
		clearInterval(window.updateInterval);

		ensureUserExists();

		var volumeIcon 		= $('div.volume-ctrl img.vol-icon');
		var transportPlay 	= $('div.transport-ctrl img#play-btn');
			_thisDevice 	= window.thisDevice;

		//Get device id of current play on device selection
		if(window.windowWidth < app_break_smmd){
			_playOnDevice =  $('#mobile-play-on option:selected').attr('data-id');
		}else{
			_playOnDevice =  $('#play-on option:selected').attr('data-id');
		}




		//Connection to socketserver runs if we choose to be a controller
		if(_thisDevice !== _playOnDevice){
			_socket = 'open';

			//Mute this controller device
			PLAYER.mute();

			//Set icon to muted icon
			volumeIcon.attr('src', 'images/icons/volume-icon-mute.svg');
		}else{
			_socket = null;

			//Unmute this controller
			PLAYER.unMute();

			//Set icon to unmuted icon
			volumeIcon.attr('src', 'images/icons/volume-icon.svg');
		}



			//Emit pause event
			if(_socket === 'open'){
				//Build obj for socket transmission
				var data = {
					'device' 			: _playOnDevice,
					'controllerDevice' 	: _thisDevice,
					'userId' 			: _userId
				}

				_socketConnect.emit('pause', data);
			}

			//Pause local video normally
			PLAYER.stopVideo();

			//Updates button ui
			transportPlay.attr('src', 'images/icons/play-wht.png');

			_playerPlaying = !_playerPlaying;


	}//pause()














	function playRandom(){

		var libraryWrapper 	= $('#libraryWrapper');

		//get list items length
		var resultLength = libraryWrapper.find('li.resultItems:eq(' + 0 + ')').attr('data-resultLength');

		//random index for shuffle mode.
		var randomIndex = Math.floor(Math.random() * resultLength);

		var getVideo = libraryWrapper.find('li.resultItems[data-index="' + randomIndex + '"]').attr('data-videoId');


		play(getVideo);


		//Set the previous index for use in the previous button functionality
		//Only push when the song being pushed is a new shuffle song
		_shuffleIndexes.push(_currentIndex);
	}











	function popupPlayer(id){

		var video = $('#video-overlay');
		var iframe = '<iframe width="' + window.windowWidth + '" height="300" src="//www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>';


		video.empty();
		video.append(iframe);

	}










	function loadPlayerScript(){

		//Load YouTube Player API scripts
		var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/player_api";

		var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		//End YouTube Player API scripts
	}












	function ensureUserExists(){

		//Ensures userId is always available
		if(_userId === undefined || !_userId || _userId === '' || _userId === null){
			if(window.userId !== undefined){
				_userId = window.userId;
				console.log(_userId, "uid");
			}else if(getCookies.userId !== undefined){
				_userId = getCookies.userId;
				window.userId = _userId;
				console.log(_userId, "cookies");
			}
		}
	}















});//define()
})();//function
