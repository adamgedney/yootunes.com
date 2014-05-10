(function(){
define(['jquery', 'getCookies'], function($, getCookies){


// var User = (function(window, document, $){



	//instances


	//private vars
	var DOM 		= {};
	var _baseUrl 	= 'http://api.atomplayer.com';
	var _userId;
	var _devices 	= [];
	var _thisDevice;











		//Listen for rendered to register DOM elements
		$(document).on('rendered', function(event){
			registerDOM(event.template);
		});


		//retrieve device array from service
		_devices = getCookies.devices;










		//Name this device
		$(document).on('click', '#submitDeviceName', function(event){
			event.preventDefault();

			//Ensures userId is always available
			if(_userId === undefined){
				if(window.userId !== undefined){
					_userId = window.userId;
				}else if(getCookies.userId !== undefined){
					_userId = getCookies.userId;
					window.userId = _userId;
				}
			}

			addDevice(_userId, function(response){

			});


		});//updateDeviceName











		//Delete device
		$(document).on('click', '#deleteDevice', function(event){
			event.preventDefault();

			var deviceId = $(this).attr('data-id');
			var API_URL = _baseUrl + '/delete-device/' + deviceId;

			//Delete device on deviceId
			$.ajax({
				url : API_URL,
				method : 'GET',
				dataType : 'json',
				success : function(response){

					console.log(response, "delete device response");

					//Fires a complete event after  device has been deleted
					$(document).trigger({
						type : 'reloadDevices'
					});


				}//success
			});//ajax
		});//updateDeviceName









			//DEVICE DETECTION
			//Flow: 1. check device cookies against user devices. If match, set this device
			//		2. If no match, prompt user to name this device
			//		3. if no cookies found, prompt user to select this device from their devices or name this new device
			// if(getCookies.devices.length !== 0){
			// 	var devices = getCookies.devices;
			// 	var match = false;

			// 	//DETERMINE WHICH DEVICE COOKIE IS THIS USER'S
			// 	getDevices(_userId, function(response){

			// 		for(var i=0;i<response.length;i++){
			// 			for(var j=0;j<devices.length;j++){

			// 				if(response[i].id === devices[j]){

			// 					//THIS IS THE USER'S DEVICE
			// 					_thisDevice 		= devices[j];
			// 					window.thisDevice 	= devices[j];
			// 					match 				= true;

			// 					renderDevices(response);

			// 					break;
			// 				}//if
			// 			}//for j
			// 		}//for i


			// 		if(match === false){

			// 			//Fade in modal to instruct user to name this device
			// 			DOM.nameDeviceModal.fadeIn();

			// 		}//if false
			// 	});//getDevices


			// }else{//NO DEVICE COOKIES FOUND


			// 	//Fade in modal to instruct user to name this device
			// 	DOM.nameDeviceModal.fadeIn();
			// 	// $('#devicePrompt').fadeIn();

			// 	//Maybe user deleted cookies? GET DEVICES TO ASK USER
			// 	getDevices(_userId, function(response){

			// 		renderDevices(response);
			// 	});//getDevices
			// }//else










	// };//constructor
	//=========================//











	//Public methods and properties.
	var exports 		= {
		getDevices 		: getDevices,
		getUser 		: getUser,
		addDevice 		: addDevice
	};





	//return exports
	return exports;









//================================//
//Class methods===================//
//================================//




	function getDevices(userId, callback){
		var API_URL = _baseUrl + '/get-devices/' + userId;

		//Get current user's devices
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				//Callback once data received
				if(typeof callback === "function"){

					callback(response);
				}
			}//success
		});//ajax
	}









	function addDevice(userId, callback){

		//retrieve device array from service
		// _devices = getCookies.devices;

		var currentDeviceId 	= "0";//default set in case we're new and not updating
		var name 				= DOM.infoDeviceName.val();
		var selectedDeviceName 	= DOM.userDevicesSelected.text();
		var selectedDeviceId 	= DOM.userDevicesSelected.attr('data-id');
		var deviceCookieAmount 	= _devices.length;


		//USER CHOSE A DEVICE NAME FROM LIST
		if(selectedDeviceName !== 'Your Devices' && name === ''){

			 //set cookie DEVICE# with device id here
			document.cookie = 'device' + (deviceCookieAmount + 1) + '=' + selectedDeviceId;
			DOM.nameDeviceModal.fadeOut();

		}else{//NEW DEVICE




			//Build API URL
			var API_URL = _baseUrl + '/device/' + _userId + '/' + name + '/' + currentDeviceId;

			//Call API to set new device or update current device
			$.ajax({
				url : API_URL,
				method : 'GET',
				dataType : 'json',
				success : function(response){

					//Set a device cookie for the new device
					document.cookie = 'device' + (deviceCookieAmount + 1) + '=' + response.newDeviceId;

					//Fires a complete event after  device has been added
					//Picked up in content controller
					$(document).trigger({
						type 		: 'reloadDevices',
						newDeviceId 	: response.newDeviceId,
						newDeviceName 	: response.newDeviceName
					});//trigger

					DOM.nameDeviceModal.fadeOut();

				}//success
			});//ajax
		}//else
	}//addDevice()














	function getUser(userId, callback){

		//Build API request
		var API_URL = _baseUrl + '/get-user/' + userId;

		//Request auth form server
		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType 	: 'json',
			success 	: function(response){


				//store theme info for app-wide use
				window.theme = response[0].theme;
				document.cookie = "theme=" + response[0].theme;

				//Set a cookie in the browser to store user id
				//Duplicate setting. Just for stability.
				document.cookie = "uid=" + response[0].id;
				window.userId 	= response[0].id;


				//Callback once data received
				if(typeof callback === "function"){

					callback(response);
				}
			}//success
		});//ajax
	}








	function registerDOM(template){

		if(template === '#app'){
			DOM.nameDeviceModal 	= $('#nameDeviceModal');
			DOM.infoDeviceName 		= $('.infoDeviceName');
			DOM.userDevicesSelected = $('#userDevices option:selected');

		}//#app

		if(template === '#landing'){

		}//#landing

		if(template === '#forgot'){

		}//#library

		if(template === '#reset'){

		}//#library

		if(template === '#library'){

		}//#library

		if(template === '#playlist'){

		}//#library

		if(template === '#subPlaylist'){

		}//#library

		if(template === '#acctSettings'){

		}//#acctSettings
	}













// })(window, document, jQuery);
});//define()
})();//function