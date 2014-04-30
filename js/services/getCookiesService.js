(function(){
define([], function(){



//Get Cookies Service============//
//Gets all cookies from browsers


	var obj = {};

	//Check for the stored cookie in the browser
	var cookie 		= document.cookie;
	var cookieArray = cookie.split("; ");
		obj.devices = [];

	//loop through cookie array
	for(var c=0;c<cookieArray.length;c++){



		//Retrieve userid cookie
		if(cookieArray[c].indexOf("uid") !== -1){

			//Set Class level userId
			obj.userId = cookieArray[c].substr(4);
		}


			//Retrieve user device cookie1
			if(cookieArray[c].indexOf("device1") !== -1){

				obj.devices.push(cookieArray[c].substr(8));
			}

			//Retrieve user device cookie2
			if(cookieArray[c].indexOf("device2") !== -1){

				obj.devices.push(cookieArray[c].substr(8));
			}

			//Retrieve user device cookie3
			if(cookieArray[c].indexOf("device3") !== -1){

				obj.devices.push(cookieArray[c].substr(8));
			}

			//Retrieve user device cookie4
			if(cookieArray[c].indexOf("device4") !== -1){

				obj.devices.push(cookieArray[c].substr(8));
			}

			//Retrieve user device cookie5
			if(cookieArray[c].indexOf("device5") !== -1){

				obj.devices.push(cookieArray[c].substr(8));
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

	return obj;






});//define()
})();//function