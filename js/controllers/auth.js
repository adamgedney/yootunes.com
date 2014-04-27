(function(){
define(['jquery', 'Content', 'getCookies', 'Init'], function($, Content, getCookies, Init){


	//Private variables
	var _auth 				= {};
	var _user 				= {};
	var _userId;
	var _thisDevice;
	var _playlistId 		= 0;
	var _baseUrl 			= 'http://yooapi.pw';


	var Auth = function(){







	//==========================================//
	//User Registration handler
	//==========================================//
	$(document).on('click', '#signupSubmit', function(event){

		var email 			= $('#signupEmail').val();
		var password 		= CryptoJS.SHA1($('#signupPass').val());
		var passwordAgain 	= CryptoJS.SHA1($('#signupPassAgain').val());

		//Run create user function
		createNewUser(email, password, passwordAgain);


		event.preventDefault();
	});//onclick














	//==========================================//
	//User authentication
	//==========================================//
	$(document).on('click', '#popdownSubmit', function(event){

		var email 		= $('#popdownEmail').val();
		var password 	= CryptoJS.SHA1($('#popdownPass').val());
		var pwString 	= '';


		//Produces 160 char string from pw
		for(var i=0;i<password.words.length;i++){

			//Concat array parts into pwString
			pwString += password.words[i].toString();
		}


		//Build API request
		var API_URL 	= _baseUrl + '/check-user/' + email + '/' + pwString;

		//Request auth form server
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success 	: function(response){

				// console.log(response, "login wth email response");

				//If user was authenticated
				if(response.success === true){

					//Load app, set cookie, fire event
					loadApplication(response);

					console.log(response, "check-user in auth response");


				}else{//response failure. User may have been deleted




					//Determine if we need to prompt user to restore account
					if(response.restorable == true){

						//Fade in restore acct modal window
						$('#restoreAcctModal').fadeIn();



						//Restore User Account Handler
						$(document).on('click', '#restoreAccountButton', function(event){

							//build API URL
							var API_URL 	= _baseUrl + '/restore-user/' + email + '/' + pwString;

							//Call API to update user account status
							//Request auth form server
							$.ajax({
								url 		: API_URL,
								method 		: 'GET',
								dataType 	: 'json',
								success 	: function(response){

									// console.log(response, "restore account success response");

									//Load app, set cookie, fire event
									loadApplication(response);

								}//success
							});//ajax
						});//onclick restorAccount




						//New Account Button Handler
						$(document).on('click', '#newAccountButton', function(event){

							var email 		= $('#popdownEmail').val();
							var password 	= CryptoJS.SHA1($('#popdownPass').val());
							var passwordAgain 	= CryptoJS.SHA1($('#popdownPass').val());

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
				    		console.log(response, "plus-user response");

				    		//If response success
				    		if(response.userId !== null || response.userId !== "" || response.userId !== undefined){

				    			//Load app, set cookie, fire event
								loadApplication(response);

				    		}//if response success
				    	}//success
				    });//ajax
			   });//user.execute
			});//gapi.client.laod


		  } else {

		    console.log('Sign-in state: ' + authResult['error']);
		  }//else
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

		//Hides error message if this isn't the first attempt
		$('#error').hide();

		var email = $('#forgotInput').val();
		var API_URL = _baseUrl + '/forgot/' + email;

		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){
				console.log(response, 'forgot pass response');

				if(response === "User null"){

					//Show error message if no user was found
					$('#error').fadeIn();
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

		var userId 		= _user.tokenResponseId;
		var password 	= CryptoJS.SHA1($('#resetInput').val());
		var pwString 	= '';


		//Produces 160 char string from pw
		for(var i=0;i<password.words.length;i++){

				//Concat array parts into pwString
				pwString += password.words[i].toString();
		}



		//Build API request
		var API_URL 	= _baseUrl + '/reset-pass/' + userId + '/' + pwString;



		//Send new password to server for update
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success 	: function(response){


				if(response === "Password reset success"){

					$('#success').fadeIn();

					//redirect user to root so they can log in with their new password
					setTimeout(rootRedirect, 5000);
				}
			}
		});//ajax
	});//click resetSubmit









	//Update user acct info from account settings page form
	$(document).on('click', '#updateInfo', function(event){
		event.preventDefault();

		var displayName 	= $('#infoName').val();
		var email 			= $('#infoEmail').val();
		var birthdate 		= $('#infoBirthdate').val();
		var title 			= $('#infoTitle').val();
		var password 		= CryptoJS.SHA1($('#infoPass').val());
		var passwordAgain 	= CryptoJS.SHA1($('#infoPassAgain').val());
		var pwString 		= ' ';
			_userId 		= $('#infoId').html();

		//Splite birthday into month/day/year
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



		//sets default on password so call won't receive empty sha3
		if($('#infoPass').val() === "" || $('#infoPassAgain').val() === ""){

			pwString = "0";

		}else{

			//Produces 160 char string from pw
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



		//Build API URL
		var API_URL = _baseUrl + '/update-user/' + _userId + '/' + title + '/' + displayName + '/' + email + '/' + birthArray[0] + '/' + birthArray[1] + '/' + birthArray[2] + '/' + pwString;

		//Call API to update user data
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				console.log(response, "update user info response");

				//Reload acct settings view
				Content.loadAcctSettings();

			}//success
		});//ajax
	});//click updateInfo







	//Delete account link pops up confirmation modal
	$(document).on('click', '#deleteAccount', function(event){
		event.preventDefault();

		//fade in modal window
		$('#deleteAcctModal').fadeIn();

	});




	//Delete account link
	$(document).on('click', '#deleteAccountButton', function(event){
		event.preventDefault();

		//Check for the stored cookie in the browser
		var cookie = document.cookie;
		var userId = cookie.indexOf("uid");

		//Stored user id
		var id = cookie.substr(userId + 4);

		//Build API URL
		var API_URL = _baseUrl + '/delete-user/' + id;

		//Call API to delete user account
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				console.log(response, "delete account response");

				//Fade out modal window
				$('#deleteAcctModal').fadeOut();


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

				//Check to be sure new user made it into DB
				if(response.response === true){

					//Delete the current user id cookie
					deleteUIDCookie();


					//Load the application, fire event, set new cookie
					loadApplication(response);

					console.log(response, "create new user response");

					//Show device namer to new user
					$('#nameDeviceModal').fadeIn();

				}else{//New user registration failed. Display why

					console.log(response, "something went wrong");
				}

			}//success
		});//ajax
	}











	function loadApplication(response){

		//Ensures userId is always available across the app
		//DO NOT REMOVE ** Library will fail to load on login
		window.userId 	= response.userId;
		window.theme 	= response.theme;
		_userId 		= response.userId;

		//load the application
		Content.loadApp();

		// //Set a cookie in the browser to store user id
		document.cookie = "uid=" 	+ response.userId;
		document.cookie = "theme=" 	+ response.theme;

		console.log(response, "load application in auth.js");

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

		//Expires uid cookie for logout funcitonality
		document.cookie = 'uid=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
	};








});//define()
})();//function