(function(){
define(['jquery', 'Content', 'getCookies', 'determineDevice','Init', 'socketService'], function($, Content, getCookies, determineDevice, Init, socketService){


	//Private variables
	var _baseUrl 	= 'http://api.atomplayer.com';
	var _auth 		= {};
	var _playlistId = 0;
	var _userId;



	var Auth = function(){














	//==========================================//
	//User Registration handler
	//==========================================//
	$(document).on('click', '#signupSubmit', function(event){

		var siblings 		= $(this).parent();
		var email 			= siblings.find('input#signupEmail').val();
		var password 		= CryptoJS.SHA1(siblings.find('input#signupPass').val());
		var passwordAgain 	= CryptoJS.SHA1(siblings.find('input#signupPassAgain').val());

		//Run create user function
		createNewUser(email, password, passwordAgain);


		event.preventDefault();
	});//onclick














	//==========================================//
	//User authentication
	//==========================================//
	$(document).on('click', '#popdownSubmit', function(event){

		var siblings 	= $(this).parent();
		var loginError 	= siblings.find('p.loginError');
		var email 		= siblings.find('input#popdownEmail').val();
		var password 	= CryptoJS.SHA1(siblings.find('input#popdownPass').val());
		var pwString 	= '';


		//Produces 160 char string from pw
		for(var i=0;i<password.words.length;i++){

			//Concat array parts into pwString
			pwString += password.words[i].toString();
		}


		//Build API request
		var API_URL 	= _baseUrl + '/check-user/' + email + '/' + pwString;

		//Request auth from server
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success 	: function(response){

				//If user was authenticated
				if(response.success === true){
					loginError.hide();

					//Load app, set cookie, fire event
					loadApplication(response[0][0]);


				}else{//response failure. User may have been deleted

					//Prompt user with error message afforadance
					loginError.text('username or password incorrect');
					loginError.fadeIn();


					//Determine if we need to prompt user to restore account
					if(response.restorable == true){

						//Fade in restore acct modal window
						$('div#restoreAcctModal').fadeIn();



						//Restore User Account Handler
						$(document).on('click', '#restoreAccountButton', function(event){

							//build API URL
							var API_URL = _baseUrl + '/restore-user/' + email + '/' + pwString;

							//Call API to update user account status
							//Request auth form server
							$.ajax({
								url 		: API_URL,
								method 		: 'GET',
								dataType 	: 'json',
								success 	: function(response){


									//Load app, set cookie, fire event
									loadApplication(response[0]);

								}//success
							});//ajax
						});//onclick restorAccount




						//New Account Button Handler
						$(document).on('click', '#newAccountButton', function(event){

							var passwordAgain 	= password;

							//Run create user function
							createNewUser(email, password, passwordAgain);


						});//onclick new account
					}//if restorable
				}//if/else response
			}//success
		});//ajax

		event.preventDefault();
	});//onclick















	//==========================================//
	//Check the state of the G+ user
	//==========================================//
	window.authCallback = function(authResult) {

		//Stores the auth for later access to token, etc.
		_auth = authResult;


			//If user is logged in
			if (authResult.status.signed_in) {
		    // Update the app to reflect a signed in user

		    //Once client has laoded, implement plus features
	  		gapi.client.load('plus','v1', function(data){

				var user = gapi.client.plus.people.get({'userId' : 'me'});

				//Request the profile defined above
				user.execute(function(profile){

					//Build URL w/ data to send to API
					var API_URL = _baseUrl + '/plus-user/' +
								profile.displayName + '/' +
								profile.id + '/' +
								profile.gender;



				    //Call API to create or get Plus user
				    $.ajax({
				    	url : API_URL,
				    	method : 'GET',
				    	dataType : 'json',
				    	success : function(response){

				    		console.log(response[0][0], "plus response");
			    			//Load app, set cookie, fire event
							loadApplication(response[0][0]);


				    	}//success
				    });//ajax
			   });//user.execute
			});//gapi.client.laod


		  }//if
	};//AuthCallback









	//http://www.googleplusdaily.com/2013/03/add-google-sign-in-in-6-easy-steps.html
	//==========================================//
	//Plus Signin
	//==========================================//
	$(document).on('click', '#gPlusSignIn', function(){
		gapi.auth.signIn(additionalParams); // Will use page level configuration
	});







	//When logout is clicked, check if user is google or email based user
	//logout out accordingly
	//==========================================//
	//Logout clicked
	//==========================================//
	$(document).on('click', '#logoutLink', function(event){
		event.preventDefault();

		disconnectUser(_auth.access_token);

	});












	//==========================================//
	//Disconnect user from Plus
	//==========================================//
	function disconnectUser(access_token) {
		var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + access_token;

		//Expire cookie & load landing page
		deleteUIDCookie();

		//Notify Google Plus user has signed out
		$.ajax({
		    type: 'GET',
		    url: revokeUrl,
		    async: false,
		    contentType: "application/json",
		    dataType: 'jsonp',
		    success: function(nullResponse) {

		      //If no error below is caught, logout was successful

				//reload landing page
				reloadLanding();

		    },

		    error: function(e) {


		      console.log(e, "error");
		      // You could point users to manually disconnect if unsuccessful
		      // https://plus.google.com/apps
		    }
		});//ajax
	}//disconnectUser













	//==========================================//
	//Forgot Password form handler
	//==========================================//
	$(document).on('click', '#forgotSubmit', function(event){
		event.preventDefault();
		var errorMsg 	= $('#error');
		var siblings 	= $(this).parent();
		var email 		= siblings.find('#forgotInput').val();
		var API_URL 	= _baseUrl + '/forgot/' + email;

		//Hides error message if this isn't the first attempt
		errorMsg.hide();

		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				if(response === "User null"){

					//Show error message if no user was found
					errorMsg.fadeIn();
				}else{

					$('#success').fadeIn();

					//reload the landing page
					setTimeout(reloadLanding, 5000);

				}

			}
		});
	});









	//==========================================//
	//Reset user password
	//==========================================//
	$(document).on('click', '#resetSubmit', function(event){
		event.preventDefault();
		var siblings 	= $(this).parent();
		var userId 		= window.tokenResponseId;
		var password 	= CryptoJS.SHA1(siblings.find('#resetInput').val());
		var pwString 	= '';


		//Produces 160 char string from pw
		for(var i=0;i<password.words.length;i++){

				//Concat array parts into pwString
				pwString += password.words[i].toString();
		}


		console.log(userId, pwString, "resetSubmit");
		//Build API request
		var API_URL 	= _baseUrl + '/reset-pass/' + userId + '/' + pwString;



		//Send new password to server for update
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success 	: function(response){

			console.log(response, "password reset success response");
				if(response === "Password reset success"){

					$('p#success').fadeIn();

					//redirect user to root so they can log in with their new password
					setTimeout(rootRedirect, 5000);
				}
			},error 	: function(response){
				console.log(response, "password reset error response");
			}
		});//ajax
	});//click resetSubmit









	//Update user acct info from account settings page form
	$(document).on('click', '#updateInfo', function(event){
		event.preventDefault();
		var siblings 		= $(this).parent();
		var displayName 	= siblings.find('input#infoName').val();
		var email 			= siblings.find('input#infoEmail').val();
		var birthdate 		= siblings.find('input#infoBirthdate').val();
		var title 			= siblings.find('#infoTitleGender option:selected').text();
			_userId 		= $('p span#infoId').html();

		//Split birthday into month/day/year
		var birthArray = birthdate.split('/');

				//sets default on display name so call won't crash
				if(displayName === ""){
					displayName = "0";
				}

				//Set default on email in case user is from Google plus
				if(email === ""){
					email = "0";
				}

				//Set default on birthdate in case user is from Google plus
				if(birthdate === ""){
					birthArray = ['0','0','0'];
				}



		//Build API URL
		var API_URL = _baseUrl + '/update-user/' + _userId + '/' + title + '/' + displayName + '/' + email + '/' + birthArray[0] + '/' + birthArray[1] + '/' + birthArray[2];

		//Call API to update user data
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){
				console.log(response, "update settings response-acct settings");

				//Reload acct settings view
				Content.loadAcctSettings();

			}//success
		});//ajax
	});//click updateInfo










	//Update user acct info from account settings page form
	$(document).on('click', '#resetPasswordInfo', function(event){
		event.preventDefault();
		var siblings 		= $(this).parent();
		var	currentPass 	= CryptoJS.SHA1(siblings.find('input#infoCurrentPass').val());
		var password 		= CryptoJS.SHA1(siblings.find('input#infoPass').val());
		var passwordAgain 	= CryptoJS.SHA1(siblings.find('input#infoPassAgain').val());
		var pwString 		= ' ';
		var currentPwString = ' ';
			_userId 		= $('p span#infoId').html();



		//sets default on password so call won't receive empty sha3
		if(password === "" || passwordAgain === ""){

			pwString = "0";


		}else{

			//Produces 160 char string from currrentPass
			for(var i=0;i<password.words.length;i++){

				//Concat array parts into pwString
				currentPwString += currentPass.words[i].toString();
			}


			//Produces 160 char string from pass/passAgain
			for(var i=0;i<password.words.length;i++){

				//Compare array of sha3 strings to make sure they match
				if(password.words[i] == passwordAgain.words[i]){

					//Concat array parts into pwString
					pwString += password.words[i].toString();

				}else{
					console.log("not same");
				}
			}//for
		}//if/else password val

console.log(_userId, currentPwString, pwString, "reset pass data");

		//Build API URL
		var API_URL = _baseUrl + '/settings-reset-pass/' + _userId + '/' + currentPwString + '/' + pwString;

		//Call API to update user data
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				console.log(response, "reset pass response- acct settings");
				//Reload acct settings view
				Content.loadAcctSettings();

			}//success
		});//ajax
	});//click resetPassword








	//Delete account link pops up confirmation modal
	$(document).on('click', '#deleteAccount', function(event){
		event.preventDefault();

		//fade in modal window
		$('div#deleteAcctModal').fadeIn();

	});




	//Delete account link
	$(document).on('click', '#deleteAccountButton', function(event){
		event.preventDefault();

		//Stored user id
		var id = getCookies.userId;

		//Build API URL
		var API_URL = _baseUrl + '/delete-user/' + id;

		//Call API to delete user account
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){


				//Fade out modal window
				$('div#deleteAcctModal').fadeOut();


				//================================//
				//Account delete/reset sequence
				//================================//
				//If user was logged in via Google Plus, log them out
				disconnectUser(_auth.access_token);

				//Delete cookie so landing page won't pick it up if refreshed
				deleteUIDCookie();

				//reload landing page
				reloadLanding();


			}//success
		});//ajax
	});//deleteAccountButton














}//Constructor function
//========================//



	// //methods and properties.
	Auth.prototype = {
		constructor 		: Auth
	};


	return Auth;













//================================//
//Class methods===================//
//================================//






	function createNewUser(email, password, passwordAgain){

		var pwString = '';



		//Produces 160 char string from pw
		for(var i=0;i<password.words.length;i++){

			//Compare array of sha3 strings
			if(password.words[i] == passwordAgain.words[i]){

				//Concat array parts into pwString
				pwString += password.words[i].toString();

			}else{
				console.log("not same");
			}
		}



		//Build API request
		var API_URL			= _baseUrl + '/new-user/' + email + '/' +  pwString + '/' +  "email";

		//Register new user
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success		: function(response){


					//Delete the current user id cookie
					deleteUIDCookie();

					//Load the application, fire event, set new cookie
					loadApplication(response[0]);


					//Show device namer to new user
					$('div#nameDeviceModal').fadeIn();


					//===================================//
					//Create a new room on the socket server for this user
					//===================================//
					socketService.createRoom(response[0].id);

			}//success
		});//ajax
	}










	function loadApplication(response){

		//Ensures userId is always available across the app
		//DO NOT REMOVE ** Library will fail to load on login
		window.userId 	= response.id;
		window.theme 	= response.theme;
		_userId 		= response.id;
		_playlistId 	= window.playlistId;

		//Fire event passing user data to listening class
		$.event.trigger({
			type 			: 'userloggedin',
			playlistId 		: _playlistId
		});

		//Store theme and uid in localstorage or set cookie if localstorage doesn't exist
		if(localStorage){
			localStorage.setItem('uid', response.id);
			localStorage.setItem('theme', response.theme);
		}else{
			//Set a cookie in the browser to store user id
			document.cookie = "uid=" 	+ response.id;
			document.cookie = "theme=" 	+ response.theme;
		}

		//load the application
		Content.loadApp();

		//#app needs to have rendered first
		determineDevice.get(function(){});
	}




	function reloadLanding(){

		//Load landing page
		Content.loadLanding();

		//force reload to force google button reload
		location.reload();
	}




	function rootRedirect(){

		//redirects to root of application
		window.location.href = '/';
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