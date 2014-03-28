var Player = (function(window, document, $){

	//Instances
	var _key = new KeyHash();


	//private vars
	var _player 			= {};

	var _playerPlaying      = false;
	var	_playerNewVideo		= true;
	var _updateInterval;
	var _seek 				= {};
		_seek.lastM			= 0,
		_seek.scrubber		= '#seek-dot';

	var _volume 			= 100;






	//constructor method
	var player = function(){





		//Listens for the player API to load
		window.onYouTubePlayerAPIReady = function() {
			// create the global player from the specific iframe (#video)
			_player = new YT.Player('video', {
				videoId : 'idSQ3hSLZ8Q',
				playerVars: {
					controls 		: 0,
					enablejsapi 	: 1,
					rel 			: 0,
					showinfo		: 0,
					modestbranding 	: 1
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

			//Play Button Click Handler=======//
			$(document).on('click', '#play-btn', function(){

				//Play if not already playing
				if(!_playerPlaying){

					play();

				//Stop playing if already playing
				}else{

					pause();
				}
			});










			//Keypress controls for play/pause etc.
			$(document).on('keypress', function(event){

				//If Spacebar pressed
				if(_key.Space){
					//Play if not already playing
					if(!_playerPlaying){

						play();

					//Stop playing if already playing
					}else{

						pause();
					}
				}

				event.preventDefault();
				return false;

			});




			//Volume Up Click Handler=======//
			$(document).on('click', '.volume-up', function(){
				volumeUp();
			});


			//Volume Down Click Handler=======//
			$(document).on('click', '.volume-down', function(){
				volumeDown();
			});




		};//On Player Ready





		//LIstens for Player API state change message
		window.onPlayerStateChange = function(event){

			var id = _player.getVideoData().video_id;
			console.log(event.data);
			if (event.data === 1){//Playing code

				//Calls updateTime() on regular intervals
		      	_updateInterval = setInterval(updateTime, 100);

		      	//If user plays video from click on video, change play/pause
		      	$('#play-btn').attr('src', 'images/icons/pause.png');

		      	//Sets list icon play/pause img
				$('.playIconImg').attr('src', 'images/icons/play-drk.png');
				$('.playIconImg[data-videoid=' + id + ']').attr('src', 'images/icons/pause-drk.png');


		    }else if(event.data < 1){//Paused code

		    	//Clears above update interval
		    	clearInterval(_updateInterval);
		    	console.log("!playing called");

		    	//If user plays video from click on video, change play/pause
		    	$('#play-btn').attr('src', 'images/icons/play-wht.png');

		    	//Sets list icon play/pause img
		    	$('.playIconImg[data-videoid=' + id + ']').attr('src', 'images/icons/play-drk.png');
		    }
		};









		//Play icon Click Handler=======//
		$(document).on('click', '.play-icon', function(event){

			var id = $(this).attr('data-videoid');
			var playerId = _player.getVideoData().video_id;

			this.newVideo;

			//Checks to see if loaded video matches this video
			if(playerId !== id){
				this.newVideo = false;
			}


				//Determines if new video needs to be loaded
				if(!this.newVideo){
					console.log("NEW video");
					_player.loadVideoById(id);


					//sets new video to false & playing to true
					this.newVideo = true;
					// _playerNewVideo = !_playerNewVideo;

					_playerPlaying = true;



				//Runs play w/out loading new video
				}else{
					console.log("NOT new video");
					//Pause playback handler
					if(_playerPlaying){
						//Pause playback
						pause();

						_playerPlaying= false;

					}else{

						play();

						//sets playing to true
						_playerPlaying = true;
					}
				}




		});











	};//constructor
	//=========================//

	//methods and properties.
	player.prototype 	= {
		constructor  	: player,
		play 		 	: play,
		pause 		 	: pause,
		volumeUp 		: volumeUp,
		volumeDown 		: volumeDown
	};

	//return constructor
	return player;









//================================//
//Class methods===================//
//================================//


	//Updates the time in the transport view
	function updateTime(){
		var time 	= _player.getCurrentTime();
		var m 		= Math.floor(time / 60);
		var secd 	= (time % 60) - 1;
		var s 		= Math.ceil(secd);

		if(s <= 0){
			s = '00';
		}else if(s < 10){
			s = '0' + s;
		}

		$('#current-time').html(m + ':' + s);



		//Scrub incrementer
		var incrementer = Math.ceil(secd);

		if(_seek.lastM !== m){
			incrementer += 60;
		}

		var scrubX = Math.floor($('#seek-bar').offset().left + incrementer);

		//Update scrubber position
		$('#seek-dot').offset({left: scrubX});


		//Sets seek bar backfill bar width
		$('.seek-fill').width($('#seek-dot').offset().left - $('.seek-line').offset().left);
	}





	function play(){

		_player.playVideo();
		// var id = _player.getVideoData().video_id;

		//Updates button ui
		$('#play-btn').attr('src', 'images/icons/pause.png');

		_playerPlaying= !_playerPlaying;

	}




	function pause(){
		_player.stopVideo();

		//Updates button ui
		$('#play-btn').attr('src', 'images/icons/play-wht.png');

		_playerPlaying = !_playerPlaying;
	}




	function volumeUp(){
		_volume += 5;

		if(_volume >= 100){
			_volume = 100;
		}

		_player.setVolume(_volume);

		console.log(_volume);
	}




	function volumeDown(){
		_volume -= 5;

		if(_volume <= 0){
			_volume = 0;
		}

		_player.setVolume(_volume);

		console.log(_volume);
	}






})(window, document,jQuery);
