(function(document, window, $){

	//Instances==========//
	var _baseUrl 		= 'http://localhost:8887';

	var _app 			= {};
		// _app.ads 		= new Ads(),
		_app.content 	= new Content();
		_app.library 	= new Library(),
		// _app.log 		= new Log(),
		_app.player 	= new Player(),
		_app.user 		= new User(),
		_app.ui 		= new Ui();

	var _auth 			= {};
	var _user 			= {};
	var _userId;





	//initializes application
	init();






//================================//
//Class methods===================//
//================================//






	//init functions
	function init(){

		//Check for URL parameters
		var params = window.location.search;
		if(params !== ""){

			//Reset password flow
			if(params.substr(1,5) === "reset"){

				//strip token from url
				var resetToken = params.substr(7);
				var API_URL = _baseUrl + '/check-reset-token/' + resetToken;


				//Call API with token to see if it exists
				$.ajax({
					url : API_URL,
					method : 'GET',
					dataType : 'json',
					success : function(response){

						//Token validity conditions
						if(response.message === "Token valid"){

							//Load the reset password view
							_app.content.loadReset();

							//Store the userId associated with the token
							_user.tokenResponseId = response.userId;

						}else{
							console.log(response, "token check response");
						}
					}
				});
			}
		}//if params





		//Check for the stored cookie in the browser
		var cookie = document.cookie;
		var userId = cookie.indexOf("uid");

		//Stored user id
		var id = cookie.substr(userId + 4);


		//If uid cookie exists
		if(userId === -1){

			//Load landing page
			_app.content.loadLanding();

		}else{

			//Load app template
			_app.content.loadApp();

			//fire event passing user data to listening class
			$.event.trigger({
				type 	: 'userloggedin',
				userId	: id
			});

			//store user id for later use
			_userId = id;
		}
	}//init













	//==========================================//
	//User Registration handler
	//==========================================//
	$(document).on('click', '#signupSubmit', function(event){

		var email 			= $('#signupEmail').val();
		var password 		= CryptoJS.SHA1($('#signupPass').val());
		var passwordAgain 	= CryptoJS.SHA1($('#signupPassAgain').val());
		var pwString 		= '';



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

					//load the application
					_app.content.loadApp();

					//fire event passing user data to listening class
					$.event.trigger({
						type 	: 'userloggedin',
						email 	: response.email,
						userId	: response.userId
					});


				}else{//New user registration failed. Display why
					console.log(response, "something went wrong");
				}

			}//success
		});//ajax


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

				console.log(response, "login wth email response");

				//If user was authenticated
				if(response.success === true){

					//load the application
					_app.content.loadApp();

					//fire event passing user data to listening class
					$.event.trigger({
						type 	: 'userloggedin',
						email 	: response.email,
						userId	: response.userId
					});


					//Set a cookie in the browser to store user id for "sessioning"
					document.cookie = "uid=" + response.userId;
				}//if
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

				    			//Set a cookie in the browser to store user id for "sessioning"
								document.cookie = "uid=" + response.userId;

				    			//Load app template
								_app.content.loadApp();

								//fire event passing user data to listening class
								$.event.trigger({
									type 	: 'userloggedin',
									userId	: response.userId
								});//event



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

		//Notify Google Plus user has signed out
		$.ajax({
		    type: 'GET',
		    url: revokeUrl,
		    async: false,
		    contentType: "application/json",
		    dataType: 'jsonp',
		    success: function(nullResponse) {

		      //If no error below is caught, logout was successful
				console.log("plus user logged out");

				//Expire cookie & load landing page
				deleteUIDCookie();

				//relaod landing page
				reloadLanding()

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
		var password 		= CryptoJS.SHA1($('#infoPass').val());
		var passwordAgain 	= CryptoJS.SHA1($('#infoPassAgain').val());
		var pwString 		= ' ';

		//sets default on display name so call won't crash
		if(displayName === ""){
			displayName = "0";
		}

		//Set default on email in case user is from Google plus
		if(email === ""){
			email = "0";
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
		var API_URL = _baseUrl + '/update-user/' + _userId + '/' + displayName + '/' + email + '/' + pwString;

		//Call API to update user data
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				console.log(response, "update user info response");

				//Reload acct settings view
				_app.content.loadAcctSettings();

			}//success
		});//ajax
	});//click updateInfo







	//Dlete account link pops up confirmation modal
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












	function reloadLanding(){

		//Load landing page
		_app.content.loadLanding();

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











})(document, window, jQuery);