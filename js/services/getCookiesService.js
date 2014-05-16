(function(){
define([], function(){



//Get Cookies Service============//
//Gets all cookies from browsers


	var obj 		= {};
		obj.devices = [];


	if(localStorage){

		obj.userId 	= localStorage.getItem('uid');
		obj.share 	= localStorage.getItem('share');
		obj.theme 	= localStorage.getItem('theme');

		//Supports storing 50 different users' devices in one browser
		for(var i=0;i<50;i++){
			if(localStorage.getItem('device' + (i + 1)) !== null){

				obj.devices.push(localStorage.getItem('device' + (i + 1)));

				//If device 50 exists, loop through and delete all devices.
				//User will be annoyed once, but they've likely used this app for
				//a while and will forgive me... Multi device fix until I have time
				//to rethink device storage
				if(localStorage.getItem('device50') !== null){
					for(var i=0;i<50;i++){

						//Deletes user's devices from local storage
						localStorage.removeItem('uid' + (i + 1));
					}

					//Might be smart to notify user of what just happened
				}
			}//if
		}//for





	}else{//Retrieve from cookies

		//Check for the stored cookie in the browser
		var cookie 		= document.cookie;
		var cookieArray = cookie.split("; ");


		//loop through cookie array
		for(var c=0;c<cookieArray.length;c++){



			//Retrieve userid cookie
			if(cookieArray[c].indexOf("uid") !== -1){

				//Set Class level userId
				obj.userId = cookieArray[c].substr(4);
			}

			//Supports storing 50 different users' devices in one browser
			for(var i=0;i<50;i++){
				if(cookieArray[c].indexOf("device" + (i + 1)) !== -1){

					if(cookieArray[c].substr(8) !== 'undefined'){
						obj.devices.push(cookieArray[c].substr(8));
					}
				}//if


				//If device 50 exists, loop through and delete all devices.
				//User will be annoyed once, but they've likely used this app for
				//a while and will forgive me... Multi device fix until I have time
				//to rethink device storage
				if(cookieArray[c].indexOf("device50") !== -1){
					for(var i=0;i<50;i++){

						//Deletes user's devices from local storage
						document.cookie = 'uid' + (i + 1) + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
					}

					//Might be smart to notify user of what just happened
				}//if
			}


			//Retrieve shared playlist cookie
			if(cookieArray[c].indexOf("share") !== -1){

				//Set playlist share value
				obj.share = cookieArray[c].substr(6);
			}

			//Retrieve theme cookie
			if(cookieArray[c].indexOf("theme") !== -1){

				//Set theme value
				obj.theme = cookieArray[c].substr(6);
			}
		}//for
	}


	return obj;


});//define()
})();//function