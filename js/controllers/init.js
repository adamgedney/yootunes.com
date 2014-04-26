(function(){
define(['jquery', 'Content', 'getCookies'], function($, Content, getCookies){




	//Private variables
	var _user 				= {};
	var _userId;
	var _thisDevice;
	var _playlistId 		= 0;
	var _baseUrl 			= 'http://yooapi.pw';








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
							_user.tokenResponseId = response.userId;

						}else{
							console.log(response, "token check response");
						}
					}
				});
			}//if reset


			//========================//
			//INitiate PLAYLIST SHARE flow
			//========================//
			if(params.substr(1,5) === "share"){

				var shareToken 	= params.substr(7);
				var tokenArray 	= shareToken.split('83027179269257243');

				//store the playlist that brought user to yootunes
				setPlaylistCookie(tokenArray[1]);

				_playlistId = tokenArray[1];
			}
		}//end URL params =======//
		//======================//














		//==========================================//
		//Get cookies from service
		//==========================================//
		var cookies = getCookies;


		//If uid cookie does not exist
		if(cookies.userId === -1 || cookies.userId === undefined){


			//Load landing page
			Content.loadLanding();


		}else{//exists

			//store user id for lpublic use
			_userId = cookies.userId;
			window.userId = _userId;

			//Load app, set cookie, fire event
			//Cookie setting here is redundant but harmless
			//Prevents duplicate code.
			loadApplication(cookies.userId);

		}//else















}//Constructor function
//========================//





	return Init;













//================================//
//Class methods===================//
//================================//













	function loadApplication(userId){

		//load the application
		Content.loadApp();

		//fire event passing user data to listening class
		$.event.trigger({
			type 			: 'userloggedin',
			playlistId 		: _playlistId
		});


		// //Set a cookie in the browser to store user id
		document.cookie = "uid=" + userId;
	}










	function setPlaylistCookie(playlistId){
		//Set a cookie in the browser to store
		//shared playlist if user not logged in
		document.cookie = "share=" + playlistId;

		_playlistId = 0;

	}














// })(document, window, jQuery);
});//define()
})();//function