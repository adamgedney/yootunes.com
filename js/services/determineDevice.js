(function(){
define(['jquery', 'getCookies', 'getUserDevices'], function($, getCookies , getUserDevices){



//DETERMINE DEVICE Service============//
//Determines what device is this user's

//DEVICE DETECTION
//Flow: 1. check device cookies against user devices. If match, set this device
//		2. If no match, prompt user to name this device
//		3. if no cookies found, prompt user to select this device from their devices or name this new device







		var determineDevice = function(){
console.log("determine ran");
			var userId = window.userId;
			var cookies = getCookies;

			if(cookies.devices.length !== 0){

				var devices = cookies.devices;
				var match = false;


				//DETERMINE WHICH DEVICE COOKIE IS THIS USER'S
				getUserDevices.get(userId, function(response){

					//Run through users devices
					for(var i=0;i<response.length;i++){

						//Run through cookies devices for each user device
						for(var j=0;j<devices.length;j++){

							//Determine if tthere's a match
							if(response[i].id === devices[j]){

								//THIS IS THE USER'S DEVICE
								obj.thisDevice 		= devices[j];
								window.thisDevice 	= devices[j];
								match 				= true;

								//Picked up by contentjs
								$.event.trigger({
									type 			: 'renderdevices',
									response 		: response,
									thisDevice 		: devices[j],
									origin 			: 'determinate'
								});

								break;
							}//if
						}//for j
					}//for i





					//If no match is made, but the cookies exist
					if(match === false){

						//Trigger event to open modal window from user.js
						$.event.trigger({
							type 	: 'namedevice',
							message : 'cookies exist | false match'
						});

					}//if false
				});//getDevices


			}else{//NO DEVICE COOKIES FOUND


					//Trigger event to open modal window from user.js
					$.event.trigger({
						type 	: 'namedevice',
						message : 'cookies do not exist'
					});
			}//else
		}//get




	return determineDevice;






});//define()
})();//function