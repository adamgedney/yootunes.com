(function(){
define(['jquery'], function($){







	var validate = function(email, pass, callback){

		var passPat 	= /^[a-zA-Z]\w{5,14}$/; //6-15 char abcd aBcd ac3D
		var emailPat 	= /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/; // standard email validation
		var response 	= {};


		if(email !== null){
			if(!emailPat.test(email)){
				response.email = false;
			}else{
				response.email = true;
			}
		}


		if(pass !== null){
			if(!passPat.test(pass)){
				response.password = false;
			}else{
				response.password = true;
			}
		}



		if(typeof callback === "function"){

			callback(response);
		}
	}









	var validateProfile = function(email, fullName, birthdate, callback){

		var emailPat 		= /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/; // standard email validation
		var letterPattern 	= /^[a-zA-Z \s]+$/;//only allow a-z /
		var numberPattern 	= /^([0-9]{1,2})[/]+([0-9]{1,2})[/]+([0-9]{2}|[0-9]{4})$/;//only allow 0-9 /
		var response 		= {};


		if(email !== null){
			if(!emailPat.test(email)){
				response.email = false;
			}else{
				response.email = true;
			}
		}

		if(fullName !== null){
			if(!letterPattern.test(fullName)){
				response.fullName = false;
			}else{
				response.fullName = true;
			}
		}

		if(birthdate !== null){
			if(!numberPattern.test(birthdate)){
				response.birthdate = false;
			}else{
				response.birthdate = true;
			}
		}

		if(typeof callback === "function"){

			callback(response);
		}
	}






	var validateResetPass = function(currentPass, pass, passAgain, callback){
		var passPat 	= /^[a-zA-Z]\w{5,14}$/; //6-15 char abcd aBcd ac3D
		var response 	= {};

			if(!passPat.test(currentPass)){
				response.currentPassword = false;
			}else{
				response.currentPassword = true;
			}

			if(!passPat.test(pass)){
				response.password = false;
			}else{
				response.password = true;
			}

			if(!passPat.test(passAgain)){
				response.passwordAgain = false;
			}else{
				response.passwordAgain = true;
			}


		if(typeof callback === "function"){

			callback(response);
		}
	}


	var validation = {
		emailPass 	: validate,
		settings   	: validateProfile,
		resetPass 	: validateResetPass
	};


	return validation;






});//define()
})();//function