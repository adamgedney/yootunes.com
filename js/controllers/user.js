var User = (function(window, document, $, CryptoJS){




	//private vars
	// var _foo = 'bar';











	//constructor function
	var user = function(){




		//User Registration handler
		$(document).on('click', '#signupSubmit', function(event){

			var email 			= $('#signupEmail').val();
			var password 		= CryptoJS.SHA3($('#signupPass').val(), { outputLength: 512 });
			var passwordAgain 	= CryptoJS.SHA3($('#signupPassAgain').val(), { outputLength: 512 });
			var pwString 		= '';
			var API_URL			= 'http://localhost:8887/search/' + email + pwString;


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

			//Authenticate user
			$.ajax({
				url: API_URL,
				method : 'GET',
				dataType : 'json',
				success: function(response){



				}//success
			});//ajax

			console.log(email, password.words, passwordAgain.words, pwString);

			event.preventDefault();
		});









	};//constructor
	//=========================//











	//methods and properties.
	user.prototype = {
		constructor : user,
		getUser 	: function(){
			var obj = {
				name: 'adam',
				email : 'adam.gedney@gmail.com',
				tel : '845.216.5030'
			}
			return obj;
		}
	};











	//return constructor
	return user;









//================================//
//Class methods===================//
//================================//











})(window, document, jQuery, CryptoJS);
