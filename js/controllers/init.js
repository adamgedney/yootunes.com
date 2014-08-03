(function(){
define(['jquery', 'Content', 'getCookies', 'socketService', 'determineDevice'], function($, Content, getCookies, socketService, determineDevice){




	//Private variables
	var _baseUrl 			= 'http://api.atomplayer.com';
	var _user 				= {};
	var _playlistId 		= 0;
	var _userId;
	var _cookies;

	//CSS breakpoints
	var app_break_smmd 	= '800';







	var Init = function(){

		_cookies = getCookies;


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

							//If the reset was initaiated by this logged in user,
							//load the application
							if(response.userId === _cookies.userId){

								window.userId = response.userId;

								initSession();

								loadApplication();

							}else{//Initate token/reset flow

								//Clear cookies that exist before we reset
								deleteUIDCookie();

								//Load the reset password view
								Content.loadReset();

								//Store the userId associated with the token
								window.tokenResponseId = response.userId;
							}


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

				//Strips the name off the playlist ID. ID is now at [0]
				var parseName 	= tokenArray[1].split('&');

				//store the playlist that brought user to yootunes
				setPlaylistCookie(parseName[0]);

				_playlistId 		= parseName[0];
				window.playlistId 	= parseName[0];

				initSession();

			}
		}else{




			//Start normal init flow
			initSession();


		}//end URL params =======//
		//======================//


























		//Capture window width
		window.windowWidth = $(window).width();










}//Constructor function
//========================//





	return Init;













//================================//
//Class methods===================//
//================================//










	function initSession(){

		if(window.windowWidth < app_break_smmd){
			//Force fullscreen on mobile devices
			if(typeof document.documentElement.requestFullscreen === 'function'){
				document.documentElement.requestFullscreen();
			}

			window.scrollTo(0,1);
		}


		//==========================================//
		//Check cookies from service
		//==========================================//

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

					//Load app, set cookie, fire event
					//Cookie setting here is redundant but harmless
					//Prevents duplicate code.
					loadApplication();

				}//AJAX success
			});//AJAX library count
		}//ELSE USER EXISTS
	}















	function loadApplication(){

		Content.loadApp(null);

		//Must be run after the app has loaded in this case
		determineDevice(function(data){

			//fire event passing user data to listening Content class
			$.event.trigger({
				type 			: 'userloggedin',
				playlistId 		: _playlistId
			});


		});//determinDevice
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










	function deleteUIDCookie(){

		if(localStorage){
			localStorage.removeItem('uid');
		}else{
			//Expires uid cookie for logout funcitonality
			document.cookie = 'uid=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
		}
	};















});//define()
})();//function