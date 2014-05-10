(function(){
define(['jquery', 'User','Content', 'getCookies', 'socketService'], function($, User, Content, getCookies, socketService){




	//Private variables
	var _user 				= {};
	var _userId;
	var _playlistId 		= 0;
	var _cookies;

	var _baseUrl 			= 'http://api.atomplayer.com';

	// var app_break_smmd 		= '800';








	var Init = function(){


		//=============================//
		//Check for URL parameters
		//=============================//
			//Handles password reset token
			//& playlist share token
		var params = window.location.search;

		if(params !== ""){


			//========================//
			//Initiate RESET PASSWORD flow
			//========================//
			if(params.substr(1,5) === "reset"){

				//strip token from url
				var resetToken = params.substr(7);

				//Build API url
				var API_URL = _baseUrl + '/check-reset-token/' + resetToken;


				//Call API with token to see if token exists
				$.ajax({
					url : API_URL,
					method : 'GET',
					dataType : 'json',
					success : function(response){

						//Token validity conditions
						if(response.message === "Token valid"){

							//Load the reset password view
							Content.loadReset();

							//Store the userId associated with the token
							window.tokenResponseId = response.userId;

						}//if
					}//success
				});//ajax
			}//if reset


			//========================//
			//INitiate PLAYLIST SHARE flow
			//========================//
			if(params.substr(1,5) === "share"){

				var shareToken 	= params.substr(7);
				var tokenArray 	= shareToken.split('83027179269257243');

				//store the playlist that brought user to yootunes
				setPlaylistCookie(tokenArray[1]);

				_playlistId 		= tokenArray[1];
				window.playlistId 	= tokenArray[1];
			}
		}//end URL params =======//
		//======================//














		//==========================================//
		//Check cookies from service
		//==========================================//
		_cookies = getCookies;


		//If uid cookie does not exist
		if(_cookies.userId === -1 || _cookies.userId === undefined || _cookies.userId === 'undefined'){


			//Load landing page
			Content.loadLanding();


		}else{//USER EXISTS

			//store user id for lpublic use
			_userId = _cookies.userId;
			window.userId = _userId;

			//Run this ASAP to prepare for library load
			//First get library count to compare against localstorage count
			var API_URL = _baseUrl + '/get-library-count/' + _userId;

			$.ajax({
				url 		: API_URL,
				method 		: 'GET',
				dataType 	: 'json',
				success 	: function(response){

					//Used By libraryLoad to check local storage
					window.libraryCount = response;

					//get the user data for stored theme
					//then load the app on success
					User.getUser(_cookies.userId, function(response){

					});




					//Load app, set cookie, fire event
					//Cookie setting here is redundant but harmless
					//Prevents duplicate code.
					loadApplication();

				}//AJAX success
			});//AJAX library count

		}//else





		$(document).on('rendered', function(event){

			//ON APP RENDER========================//
			if(event.template === '#app'){


				console.log("#app in init");
				//Determine this device before we laod application
				determineDevice();
			}

		});










		//Capture window width
		window.windowWidth = $(window).width();










}//Constructor function
//========================//


	// Init.prototype = {
	// 	getUser : getUser
	// }


	return Init;













//================================//
//Class methods===================//
//================================//













	function loadApplication(){

		//fire event passing user data to listening class
		$.event.trigger({
			type 			: 'userloggedin',
			playlistId 		: _playlistId
		});

		//load the application
		Content.loadApp();

	}










	function setPlaylistCookie(playlistId){
		//Set a cookie in the browser to store
		//shared playlist if user not logged in
		document.cookie = "share=" + playlistId;

		_playlistId = 0;

	}









	function determineDevice(){

		console.log("determine ran in initjs");
		//DEVICE DETECTION
			//Flow: 1. check device cookies against user devices. If match, set this device
			//		2. If no match, prompt user to name this device
			//		3. if no cookies found, prompt user to select this device from their devices or name this new device
			if(_cookies.devices.length !== 0){
				var devices = _cookies.devices;
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


								$.event.trigger({
									type 			: 'gotdevices',
									response 		: response,
									thisDevice 		: devices[j],
									origin 			: 'determinate'
								});

								// renderDevices(response);
								console.log("this device in init", window.thisDevice);
								break;
							}//if
						}//for j
					}//for i


					if(match === false){

						//Fade in modal to instruct user to name this device
						$('div#nameDeviceModal').fadeIn();

					}//if false
				});//getDevices


			}else{//NO DEVICE COOKIES FOUND

console.log("none found");
				// Fade in modal to instruct user to name this device
				$('div#nameDeviceModal').fadeIn();
				$('#devicePrompt').fadeIn();

				//Maybe user deleted cookies? GET DEVICES TO ASK USER
				User.getDevices(_userId, function(response){

					$.event.trigger({
						type 			: 'gotdevices',
						response 		: response,
						origin 			: 'indeterminate'
					});

					// renderDevices(response);
				});//getDevices
			}//else
	}






});//define()
})();//function