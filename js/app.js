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



		//URI reference=============//
		// _app.route 				= {},
		// _app.route.protocol 	= window.location.protocol,
		// _app.route.host 		= window.location.host,
		// _app.route.path 		= window.location.pathname;




	//initializes application
	init();






//================================//
//Class methods===================//
//================================//






	//init functions
	function init(){
	_app.content.loadLanding();
		//Check for the stored cookie in the browser
		var cookie = document.cookie;
		var userId = cookie.indexOf("uid");

		//Stored user id
		var id = cookie.substr(userId + 4);


		// //If uid cookie exists
		// if(userId === -1){

		// 	//Load app template
		// 	_app.content.loadLanding();

		// }else{

		// 	//Load app template
		// 	_app.content.loadApp();

		// 	//fire event passing user data to listening class
		// 	$.event.trigger({
		// 		type 	: 'userloggedin',
		// 		userId	: id
		// 	});
		// }



	}//init










	//User Registration handler
	$(document).on('click', '#signupSubmit', function(event){

		var email 			= $('#signupEmail').val();
		var password 		= CryptoJS.SHA3($('#signupPass').val(), { outputLength: 512 });
		var passwordAgain 	= CryptoJS.SHA3($('#signupPassAgain').val(), { outputLength: 512 });
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















	//User authentication
	$(document).on('click', '#popdownSubmit', function(event){
		var email 		= $('#popdownEmail').val();
		var password 	= CryptoJS.SHA3($('#popdownPass').val(), { outputLength: 512 });
		var pwString 	= '';


		//Produces 160 char string from pw
		for(var i=0;i<password.words.length;i++){

				//Concat array parts into pwString
				pwString += password.words[i].toString();
		}




		//Build API request
		var API_URL 	= _baseUrl + '/get-user/' + email + '/' + pwString;

		//Request auth form server
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success 	: function(response){

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











	//Check the state of the G+ user
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
								profile.displayName + '/' + profile.id + '/' +
								profile.gender + '/' + profile.image.url + '/' +
								profile.etag;



				    //Call API to create or get Plus user
				    $.ajax({
				    	url : API_URL,
				    	method : 'GET',
				    	dataType : 'json',
				    	success : function(response){
				    		console.log(response, "plus-user response");
				    	}

				    });

			   });//user.execute
			});//gapi.client.laod


		  } else {

		    console.log('Sign-in state: ' + authResult['error']);
		  }//else
	};//AuthCallback









	//http://www.googleplusdaily.com/2013/03/add-google-sign-in-in-6-easy-steps.html
	$(document).on('click', '#gPlusSignIn', function(){
		gapi.auth.signIn(additionalParams); // Will use page level configuration
	});







	//When logout is clicked, check if user is google or email based user
	//logout out accordingly
	$(document).on('click', '#logoutPlus', function(event){
		event.preventDefault();

		disconnectUser(_auth.access_token);

	});













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

		    },

		    error: function(e) {


		      console.log(e, "error");
		      // You could point users to manually disconnect if unsuccessful
		      // https://plus.google.com/apps
		    }
		});//ajax
	}//disconnectUser

























})(document, window, jQuery);