(function(){
define(['jquery', 'Content', 'getCookies', 'User', 'validation', 'logging', 'determineDevice','Init', 'socketService'],
	function($, Content, getCookies, User, validation, logging, determineDevice, Init, socketService){


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
		event.preventDefault();

		//Expire cookie & load landing page
		deleteUIDCookie();

		var siblings 			= $(this).parent();
		var emailInput 			= siblings.find('#signupEmail');
		var email 				= emailInput.val();
		var signupError 		= siblings.find('p.signupError');

		var passInput 			= siblings.find('#signupPass');
		var passInputAgain 		= siblings.find('#signupPassAgain')
		var passInputVal 		= passInput.val();
		var passInputAgainVal 	= passInputAgain.val();

		var password 			= CryptoJS.SHA1(passInputVal);
		var passwordAgain 		= CryptoJS.SHA1(passInputAgainVal);
		var pwString 			= '';

		passInput.removeClass('animated bounce');
		passInputAgain.removeClass('animated bounce');
		emailInput.removeClass('animated bounce');
		signupError.hide();



		//Produces 160 char string from pw
		for(var i=0;i<password.words.length;i++){

			//Concat array parts into pwString
			pwString += password.words[i].toString();
		}


		//Check if passwords match
		if(passInputVal !== passInputAgainVal){
			//Prompt user with error message afforadance
			signupError.text('Passwords don\'t match');
			signupError.fadeIn();

			//Bounce error affordance
			passInput.addClass('animated bounce');
			passInputAgain.addClass('animated bounce');


		}else{


			//Validate email and password
			validation.emailPass(email, passInputVal, function(resp){

				if(resp.email === false){

					//Prompt user with error message afforadance
					signupError.text('Check email address for typos');
					signupError.fadeIn();

					//Bounce error affordance
					emailInput.addClass('animated bounce');

				}else if(resp.password === false){

					//Prompt user with error message afforadance
					signupError.text('Your password isn\'t strong enough');
					signupError.fadeIn();

					//Bounce error affordance
					passInput.addClass('animated bounce');
					passInputAgain.addClass('animated bounce');
				}


				//Email and password fields validate
				if(resp.email === true && resp.password === true){
					signupError.fadeOut();

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

								//Load app, set cookie, fire event
								loadApplication(response[0][0]);

								//Log user signing in from registration
								//form for testing purposes
								logging.logLoginFromSignup();

							}else{//User doesn't already exist

								//Run create user function
								createNewUser(email, password, passwordAgain);

							}//if
						}//success
					});//ajax
				};//validate true
			});//validate
		}//else passwords match
	});//onclick














	//==========================================//
	//User authentication
	//==========================================//
	$(document).on('click', '#popdownSubmit', function(event){
		//Expire cookie & load landing page
		deleteUIDCookie();

		var siblings 	= $(this).parent();
		var loginError 	= siblings.find('p.loginError');

		var emailInput 	= siblings.find('#popdownEmail');
		var email 		= emailInput.val();

		var passInput 	= siblings.find('#popdownPass');
		var passField 	= passInput.val();

		var password 	= CryptoJS.SHA1(passField);
		var pwString 	= '';

		loginError.hide();
		emailInput.removeClass('animated bounce');
		passInput.removeClass('animated bounce');

		//Produces 160 char string from pw
		for(var i=0;i<password.words.length;i++){

			//Concat array parts into pwString
			pwString += password.words[i].toString();
		}


		//Validate email and password
		validation.emailPass(email, passField, function(resp){

			if(resp.email === false){

				//Prompt user with error message afforadance
				loginError.text('Check email address for typos');
				loginError.fadeIn();

				//Bounce error affordance
				emailInput.addClass('animated bounce');

			}else if(resp.password === false){

				//Prompt user with error message afforadance
				loginError.text('Your password isn\'t strong enough');
				loginError.fadeIn();

				//Bounce error affordance
				passInput.addClass('animated bounce');
			}


			//Email and password fields validate
			if(resp.email === true && resp.password === true){

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

							//log the login
							logging.logLogin();

						}else{//response failure. User may have been deleted

							//Prompt user with error message afforadance
							loginError.text('username or password incorrect');
							loginError.fadeIn();

							//Bounce error affordance
							emailInput.addClass('animated bounce');
							passInput.addClass('animated bounce');


							//Determine if we need to prompt user to restore account
							if(response.restorable == true){

								//Fade in restore acct modal window
								$('#restoreAcctModal').fadeIn();



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

											//log the login
											logging.logLogin();

										}//success
									});//ajax
								});//onclick restorAccount




								//New Account Button Handler
								$(document).on('click', '#newAccountButton', function(event){

									var passwordAgain 	= password;

									//Run create user function
									createNewUser(email, password, passwordAgain);


								});//onclick new account
							}else{
								//user never existed. Log failed login attempt
								logging.logFailedLogin();
							}//if restorable
						}//if/else response
					}//success
				});//ajax
			}//validate true
		});//validate

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

				    			//Load app, set cookie, fire event
								loadApplication(response[0][0]);

								//log the login
								logging.logLogin();


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

		//Log the logout
		logging.logLogout();

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

		var emailInput 	= siblings.find('#forgotInput');
		var email 		= emailInput.val();
		var API_URL 	= _baseUrl + '/forgot/' + email;

		//Hides error message if this isn't the first attempt
		errorMsg.hide();
		emailInput.removeClass('animated bounce');


		//Validate email
		validation.emailPass(email, null, function(resp){

			if(resp.email === false){

				//Prompt user with error message afforadance
				errorMsg.text('Check your email address for typos');
				errorMsg.fadeIn();

				//Bounce error affordance
				emailInput.addClass('animated bounce');

			}


			//Email field validates
			if(resp.email === true){
				$.ajax({
					url : API_URL,
					method : 'GET',
					dataType : 'json',
					success : function(response){

						if(response === "User null"){

							//Show error message if no user was found
							errorMsg.text('That email doesn\'t exist in our system. Got some typos? Are you sure you didn\'t log in with Google?');
							errorMsg.fadeIn();
						}else{

							$('#success').fadeIn();

							//reload the landing page
							setTimeout(reloadLanding, 5000);

						}

					}
				});//ajax
			}//validate true
		});//validate


	});









	//==========================================//
	//Reset user password
	//==========================================//
	$(document).on('click', '#resetSubmit', function(event){
		var siblings 	= $(this).parent();
		var userId 		= window.tokenResponseId;
		var errorMsg 	= $('#error');

		var passInput 	= siblings.find('#resetInput');
		var passInputVal= passInput.val();
		var password 	= CryptoJS.SHA1(passInputVal);
		var pwString 	= '';

		errorMsg.hide();
		passInput.removeClass('animated bounce');


		//Produces 160 char string from pw
		for(var i=0;i<password.words.length;i++){

				//Concat array parts into pwString
				pwString += password.words[i].toString();
		}


		//Validate password
		validation.emailPass(null, passInputVal, function(resp){

			if(resp.password === false){

				//Prompt user with error message afforadance
				errorMsg.text('Password must be 2 million characters long with 1000 special characters and 14 capital letters...   Just kidding. Try making it stronger though.');
				errorMsg.fadeIn();

				//Bounce error affordance
				passInput.addClass('animated bounce');

			}


			//Email field validates
			if(resp.password === true){

				//Build API request
				var API_URL 	= _baseUrl + '/reset-pass/' + userId + '/' + pwString;

				//Send new password to server for update
				$.ajax({
					url 		: API_URL,
					method 		: 'GET',
					dataType 	: 'json',
					success 	: function(response){


						if(response === "Password reset success"){

							errorMsg.hide();
							$('p#success').fadeIn();

							//redirect user to root so they can log in with their new password
							setTimeout(rootRedirect, 5000);
						}
					},error : function(response){

					}
				});//ajax
			}//validate true
		});//validate

	event.preventDefault();
	});//click resetSubmit









	//Update user acct info from account settings page form
	$(document).on('click', '#updateInfo', function(event){
		event.preventDefault();

		_userId 			= $('#infoId').html();
		var siblings 		= $(this).parent();
		var emailInput 		= siblings.find('#infoEmail');
		var nameInput 		= siblings.find('#infoName');
		var birthdateInput 	= siblings.find('#infoBirthdate');

		var displayName 	= nameInput.val();
		var email 			= emailInput.val();
		var birthdate 		= birthdateInput.val();
		var title 			= siblings.find('#infoTitleGender option:selected').text();
		var errorMsg 		= $('#updateProfileError');

		errorMsg.hide();
		nameInput.removeClass('animated bounce');
		emailInput.removeClass('animated bounce');
		birthdateInput.removeClass('animated bounce');



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




		validation.settings(email, displayName, birthdate, function(resp){

			if(resp.email === false){

				//Prompt user with error message afforadance
				errorMsg.text('Check your email address for typos.');
				errorMsg.fadeIn();

				//Bounce error affordance
				emailInput.addClass('animated bounce');

			}else if(resp.fullName === false){

				//Prompt user with error message afforadance
				errorMsg.text('Your name may only contain letters. Oh. Wait. Deadmau5 might have an issue here.');
				errorMsg.fadeIn();

				//Bounce error affordance
				nameInput.addClass('animated bounce');

			}else if(resp.birthdate === false){

				//Prompt user with error message afforadance
				errorMsg.text('A birthdate should be written as 00/00/0000. Only numbers and / allowed');
				errorMsg.fadeIn();

				//Bounce error affordance
				birthdateInput.addClass('animated bounce');

			}


			//Fields validates
			if(resp.email === true && resp.fullName === true && resp.birthdate === true){

				//Build API URL
				var API_URL = _baseUrl + '/update-user/' + _userId + '/' + title + '/' + displayName + '/' + email + '/' + birthArray[0] + '/' + birthArray[1] + '/' + birthArray[2];

				//Call API to update user data
				$.ajax({
					url : API_URL,
					method : 'GET',
					dataType : 'json',
					success : function(response){

						//Reload acct settings view
						Content.loadAcctSettings();

					}//success
				});//ajax
			}//validate true
		});//validate
	});//click updateInfo










	//Update user acct info from account settings page form
	$(document).on('click', '#resetPasswordInfo', function(event){
		event.preventDefault();
		var siblings 			= $(this).parent();
		var currentInput 		= siblings.find('#infoCurrentPass');
		var passwordInput 		= siblings.find('#infoPass');
		var passwordAgainInput	= siblings.find('#infoPassAgain');

		var	currentPass 		= CryptoJS.SHA1(currentInput.val());
		var password 			= CryptoJS.SHA1(passwordInput.val());
		var passwordAgain 		= CryptoJS.SHA1(passwordAgainInput.val());
		var pwString 			= ' ';
		var currentPwString 	= ' ';
		var errorMsg 			= $('#resetPasswordError');
			_userId 			= $('p span#infoId').html();

		errorMsg.hide();
		currentInput.removeClass('animated bounce');
		passwordInput.removeClass('animated bounce');
		passwordAgainInput.removeClass('animated bounce');


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

				}
			}//for
		}//if/else password val




		//Check if passwords match first
		if(passwordInput.val() === passwordAgainInput.val()){
			//Validation===================//
			validation.resetPass(currentInput.val(), passwordInput.val(), passwordAgainInput.val(), function(resp){

				if(resp.currentPassword === false){

					//Prompt user with error message affordance
					errorMsg.text('Your current password needs to be stronger');
					errorMsg.fadeIn();

					//Bounce error affordance
					currentInput.addClass('animated bounce');

				}else if(resp.password === false){

					//Prompt user with error message affordance
					errorMsg.text('Your new password needs to be strong like bull');
					errorMsg.fadeIn();

					//Bounce error affordance
					passwordInput.addClass('animated bounce');

				}else if(resp.passwordAgain === false){

					//Prompt user with error message affordance
					errorMsg.text('Your new password needs to be strong like bull');
					errorMsg.fadeIn();

					//Bounce error affordance
					passwordAgainInput.addClass('animated bounce');

				}


				//Fields validate
				if(resp.currentPassword === true && resp.password === true && resp.passwordAgain === true){

					//Build API URL
					var API_URL = _baseUrl + '/settings-reset-pass/' + _userId + '/' + currentPwString + '/' + pwString;

					//Call API to update user data
					$.ajax({
						url : API_URL,
						method : 'GET',
						dataType : 'json',
						success : function(response){

							//Reload acct settings view
							Content.loadAcctSettings();

						}//success
					});//ajax
				};//validate true
			});//validate
		}else{//passwords don't match

			//Prompt user with error message afforadance
			errorMsg.text('New password fields don\'t match');
			errorMsg.fadeIn();

			//Bounce error affordance
			passwordInput.addClass('animated bounce');
			passwordAgainInput.addClass('animated bounce');

		}//else password match/don't match
	});//click resetPassword








	//Delete account link pops up confirmation modal
	$(document).on('click', '#deleteAccount', function(event){
		event.preventDefault();

		//fade in modal window
		$('#deleteAcctModal').fadeIn();

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

				//Log the logout
				logging.logLogout();


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

					//Once user is retrieved, load app.
					//get uSer sets user cookies
					User.getUser(response[0].id, function(){

						//Load the application, fire event, set new cookie
						loadApplication(response[0]);

						//log the login
						logging.logLogin();


						//===================================//
						//Create a new room on the socket server for this user
						//===================================//
						socketService.createRoom(response[0].id);
					});



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
		Content.loadApp(function(){

			determineDevice(function(data){

				});//determine
		});


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