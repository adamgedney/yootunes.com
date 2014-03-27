var Player = (function(window, document, $){

	//private vars
	var _player 		= {};
		_player.playing = false;

	var _key = new KeyHash();





	//constructor fuction
	var player = function(){





		//Listens for the player API to load
		window.onYouTubePlayerAPIReady = function() {
			// create the global player from the specific iframe (#video)
			_player = new YT.Player('video', {
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
				if(!_player.playing){

					play();

				//Stop playing if already playing
				}else{

					pause();

				}
			});




			//Keypress controls for play/pause etc.
			$(document).on('keypress', function(event){
				if(_key.Space){
					//Play if not already playing
					if(!_player.playing){

						play();

					//Stop playing if already playing
					}else{

						pause();

					}
				}
			});




		};//On Player Ready





		//LIstens for Player API state change message
		window.onPlayerStateChange = function(event){

			if (event.data == YT.PlayerState.PLAYING) {

				//Calls updateTime() on regular intervals
		      	setInterval(updateTime, 100);

		      	//If user plays video from click on video, change play/pause
		      	$('#play-btn').attr('src', 'images/icons/pause.png');
		    }else{

		    	//If user plays video from click on video, change play/pause
		    	$('#play-btn').attr('src', 'images/icons/play-wht.png');
		    }
		};











	};//constructor
	//=========================//

	//methods and properties.
	player.prototype = {
		constructor  : player
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
		var secd 	= time % 60;
		var s 		= Math.ceil(secd)

		$('#current-time').html(m + ':' + s);
	}





	function play(){
		_player.playVideo();

		//Updates button ui
		$('#play-btn').attr('src', 'images/icons/pause.png');

		_player.playing= !_player.playing;
	}




	function pause(){
		_player.stopVideo();

		//Updates button ui
		$('#play-btn').attr('src', 'images/icons/play-wht.png');

		_player.playing = !_player.playing;
	}








})(window, document,jQuery);
