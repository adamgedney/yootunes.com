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
		_seek.scrubber		= '#seek-dot',
		_seek.stepper		= 0;

	var _resultLength 		= 0;
	var _currentIndex 		= 0;
	var _shuffleIndexes 	= [];
	var _prevIndex 			= 0;
	var _playingVideo     	= '';

	var _playMode 			= {};
		_playMode.loop 		= false;
		_playMode.shuffle 	= false;






	//constructor method
	var player = function(){


		//Play sequence logic notes:
		//When PLAY ALL is clicked...
		//When li-groups load, store their index (or youtube id?) in an array.
		//When player state change is = END, load the next array item.

		//For shuffle, when clicked randomly pull youtube id from list when END is called


		//Listen for library to be rendered
		$(document).on('rendered', function(event){

			//When libary items have loaded
			if(event.template === '#libraryItem'){

				//When list is loaded, if list item video is playing, set icon to pause

				$('.playIconImg[data-videoid=' + _playingVideo + ']').attr('src', 'images/icons/pause-drk.png');


				//Loop through all list items to assign an index number
				$('.resultItems').each(function(index, value){

					//Sets an index number to each li item
					$('.resultItems:eq(' + index + ')').attr('data-index', index);


				});//each
			};//#libraryItem
		});//on rendered









		$(document).on('click', '#playAll', function(event){

			//Flip icon to pause icon
			// $('#playAllIcon').attr('src', 'images/icons/pause-drk.png');

			var firstVideo = $('.resultItems[data-index="0"]').attr('data-videoId');

			//set current index
			_currentIndex = 0;

			//Start playing
			_player.loadVideoById(firstVideo);

		});









		$(document).on('click', '#loopSong', function(event){


			if(!_playMode.loop){

				_playMode.loop = !_playMode.loop;

				//Reset shuffle button and boolean val
				_playMode.shuffle 	= false;
				$('#shuffleResults').attr('src', 'images/icons/shuffle-icon.png');

				//Change icon to indicate selection
				$(this).attr('src', 'images/icons/loop-icon-red.png');
			}else{

				_playMode.loop = !_playMode.loop;


				$(this).attr('src', 'images/icons/loop-icon.png');
			}

		});









		$(document).on('click', '#shuffleResults', function(event){

			if(!_playMode.shuffle){

				_playMode.shuffle 	= !_playMode.shuffle;

				//Reset loop button and boolean val
				_playMode.loop 		= false;
				$('#loopSong').attr('src', 'images/icons/loop-icon.png');

				//Change opacity to indicate selection
				$(this).attr('src', 'images/icons/shuffle-icon-red.png');

			}else{

				_playMode.shuffle = !_playMode.shuffle;

				//Change opacity to full visibility
				$(this).attr('src', 'images/icons/shuffle-icon.png');
			}

		});









		//Prev/Next Click Handler=======//
		$(document).on('click', '#prev-btn', function(){

			//If shuffle is enabled, load a new random song
			if(_playMode.shuffle){


				_prevIndex -= 1 ;

				//Gets index number of previous shuffle videos stored in shuffleIndex array
		    	var prevVideo = $('.resultItems[data-index="' + _shuffleIndexes[_prevIndex + _shuffleIndexes.length] + '"]').attr('data-videoId');

				//Start playing
				_player.loadVideoById(prevVideo);


			}else{//Normal prev button behavior

				//set current index
				_currentIndex = parseInt(_currentIndex, 10) - 1;

		    	var prevVideo = $('.resultItems[data-index="' + _currentIndex + '"]').attr('data-videoId');

				//Start playing
				_player.loadVideoById(prevVideo);
			}



		});


		//Next btn  Click Handler=======//
		$(document).on('click', '#next-btn', function(){

			//If shuffle is enabled, load a new random song
			if(_playMode.shuffle){

				playRandom();


			}else{//Normal next button behavior

				//set current index
				_currentIndex = parseInt(_currentIndex, 10) + 1;

		    	var nextVideo = $('.resultItems[data-index="' + _currentIndex + '"]').attr('data-videoId');

				//Start playing
				_player.loadVideoById(nextVideo);
			}
		});












		//Listens for the player API to load
		window.onYouTubePlayerAPIReady = function() {
			// create the global player from the specific iframe (#video)
			_player = new YT.Player('video', {
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









			//NOTE:: ** Only allow if serach is NOT in FOCUS
			//Keypress controls for play/pause etc.
			// $(document).on('keypress', function(event){

			// 	//If Spacebar pressed
			// 	if(_key.Space){
			// 		//Play if not already playing
			// 		if(!_playerPlaying){

			// 			play();

			// 		//Stop playing if already playing
			// 		}else{

			// 			pause();
			// 		}
			// 	}

			// 	event.preventDefault();
			// 	return false;

			// });




			//Volume Handler=======//
			$(document).on('mousemove', '#volumeRange', function(){

				var rangeVolume = $('#volumeRange').val();

				_player.setVolume(rangeVolume);

			});





		};//On Player Ready





		//LIstens for Player API state change message
		window.onPlayerStateChange = function(event){

			var id = _player.getVideoData().video_id;


			//================================//
			//Playing code
			//================================//
			if (event.data === 1){


				//Set song data & UI Changes
				var playing 			= $('.play-icon[data-videoId=' + id + ']');
				var song 				= $('#infoTitle');
				var artist 				= $('#infoArtist');
				var album 				= $('#infoAlbum');
				var dataSong 			= $(playing).attr('data-song');
				var dataArtist 			= $(playing).attr('data-artist');
				var dataAlbum 			= $(playing).attr('data-album');
				var fbShareMain 		= $('#fbShareMain');
				var googleShareMain 	= $('#googleShareMain');
				var twitterShareMain 	= $('#twitterShareMain');
				var linkShareMain 		= $('#linkShareMain');
				var youtubeUrl 			= 'https://www.youtube.com/watch?v=' + id;

				song.html(dataSong);
				artist.html(dataArtist);
				album.html(dataAlbum);
				fbShareMain.attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + youtubeUrl);
				googleShareMain.attr('href', 'https://plus.google.com/share?url=' + youtubeUrl);
				twitterShareMain.attr('href', 'https://twitter.com/home?status=' + youtubeUrl);
				linkShareMain.attr('href', youtubeUrl);


				//NOTE:*****
				//This is actually the current index. Clean up possible duplicate setting of this value later.
				//This is the ideal place to set current index
				_currentIndex = playing.parent().attr('data-index');


				//Set playing variable for use by the onrendered event
				_playingVideo = id;

				//Calls updateTime() on regular intervals
		      	_updateInterval = setInterval(updateTime, 100);

		      	//If user plays video from click on video, change play/pause
		      	$('#play-btn').attr('src', 'images/icons/pause.png');



		      	//Sets list icon play/pause img
				$('.playIconImg').attr('src', 'images/icons/play-drk.png');
				$('.playIconImg[data-videoid=' + id + ']').attr('src', 'images/icons/pause-drk.png');


				//Set info section animation to playing wave animation
				$('.playingAnimation').attr('src', 'images/icons/wave-animated.gif');





			//================================//
			//Paused code
			//================================//
		    }else if(event.data < 1){



		    	//Clears above update interval
		    	clearInterval(_updateInterval);
		    	// console.log("!playing called");

		    	//If user plays video from click on video, change play/pause
		    	$('#play-btn').attr('src', 'images/icons/play-wht.png');

		    	//Sets list icon play/pause img
		    	$('.playIconImg[data-videoid=' + id + ']').attr('src', 'images/icons/play-drk.png');

		    	//Set info section animation to noto logomark
				$('.playingAnimation').attr('src', 'images/icons/note.svg');

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
					_player.loadVideoById(id);



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

			    	var currentVideo = $('.resultItems[data-index="' + _currentIndex + '"]').attr('data-videoId');

					//Start playing
					_player.loadVideoById(currentVideo);


		    	}
		    }
		};







//NOTEEE:*** Move into "on player ready"

//NOTE: May need to add an event fired from the "return to search results
//interaction" to reset the play button to a pause button
		//Play icon Click Handler=======//
		$(document).on('click', '.play-icon', function(event){

			var playerId = _player.getVideoData().video_id;
			var id = $(this).attr('data-videoid');

			//Sets the current index to enable autoplay feature funcitonality
			_currentIndex = $(this).parent().attr('data-index');

			this.newVideo;

			//Checks to see if loaded video matches this video
			if(playerId !== id){
				this.newVideo = false;
			}


				//Determines if new video needs to be loaded
				if(!this.newVideo){
					console.log("NEW video");
					_player.loadVideoById(id);


					//Resets stepper for seekbar fill reset
					_seek.stepper = 0;
					_seek.lastM = 0;


					//sets new video to false & playing to true
					this.newVideo = true;
					// _playerNewVideo = !_playerNewVideo;

					_playerPlaying = true;



				//Runs play w/out loading new video
				}else{




					//Pause playback handler
					if(_playerPlaying){
						//Pause playback
						pause();

						//Set playAll icon to play icon if it wasn't already
						// $('#playAllIcon').attr('src', 'images/icons/play-drk.png');

						_playerPlaying= false;

					}else{

						play();

						//sets playing to true
						_playerPlaying = true;
					}//else
				}//else
		});//onclick play icon


























	};//constructor
	//=========================//

	//methods and properties.
	player.prototype 	= {
		constructor  	: player,
		play 		 	: play,
		pause 		 	: pause
	};

	//return constructor
	return player;









//================================//
//Class methods===================//
//================================//


	//Updates the time in the transport view
	function updateTime(){

		var duration 	= _player.getDuration();

		var time 		= _player.getCurrentTime();
		var m 			= Math.floor(time / 60);
		var secd 		= (time % 60) - 1;
		var s 			= Math.ceil(secd);

		var seek_time = ((300 / duration) * s) + _seek.stepper + $('.seek-line').offset().left;

		if(s <= 0){
			s = '00';
		}else if(s < 10){
			s = '0' + s;
		}

		$('#current-time').html(m + ':' + s);



		//Adds 60 to incrementer for each m
		if(m !== 0 && _seek.lastM !== m){
			_seek.stepper += 60;

			_seek.lastM = m;

		}



		//Update scrubber position
		$('#seek-dot').offset({left: seek_time});


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




	function playRandom(){

		//get list items length
		var resultLength = $('li.resultItems:eq(' + 0 + ')').attr('data-resultLength');

		//random index for shuffle mode.
		var randomIndex = Math.floor(Math.random() * resultLength);

		var getVideo = $('.resultItems[data-index="' + randomIndex + '"]').attr('data-videoId');

		//Start playing next video in shuffle
		_player.loadVideoById(getVideo);


		//Set the previous index for use in the previous button functionality
		//Only push when the song being pushed is a new shuffle song
		_shuffleIndexes.push(_currentIndex);
	}











})(window, document,jQuery);
