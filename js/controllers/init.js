(function(){
define(['jquery', 'User','Content', 'getCookies', 'socketService', 'determineDevice'], function($, User, Content, getCookies, socketService, determineDevice){




	//Private variables
	var _baseUrl 			= 'http://api.atomplayer.com';
	var _user 				= {};
	var _playlistId 		= 0;
	var _userId;
	var _cookies;









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
			//Initiate PLAYLIST SHARE flow
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
		if(_cookies.userId === null ||_cookies.userId === -1 || _cookies.userId === undefined || _cookies.userId === 'undefined'){


			//Load landing page
			Content.loadLanding();


		}else{//USER EXISTS

			//store user id for global use
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

					//Used By Content.;oadLibrary to check local storage
					window.libraryCount = response;

					//get the user data for stored theme
					//then load the app on success
					//**Sets theme and uid cookie
					User.getUser(_cookies.userId, function(){});


					//Load app, set cookie, fire event
					//Cookie setting here is redundant but harmless
					//Prevents duplicate code.
					loadApplication();

				}//AJAX success
			});//AJAX library count
		}//ELSE USER EXISTS











		//Capture window width
		window.windowWidth = $(window).width();










}//Constructor function
//========================//





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

		//#app needs to have rendered first
		determineDevice.get(function(){});
	}










	function setPlaylistCookie(playlistId){

		//Set a localstorage or cookie in the browser to store
		//shared playlist if user not logged in
		if(localStorage){
			localStorage.setItem('share', playlistId);
		}else{
			document.cookie = "share=" + playlistId;
		}


		_playlistId = 0;

	}















});//define()
})();//function