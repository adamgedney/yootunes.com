(function(){
define(['jquery', 'getCookies'], function($, getCookies){


// var User = (function(window, document, $){



	//instances


	//private vars
	var _baseUrl 	= 'http://api.yootunes.com';
	var _userId;
	var _devices 	= [];
	var _thisDevice;












	//constructor function
	// var user = function(){


		//retrieve device array from service
		_devices = getCookies.devices;


		// //If device cookie doesn't/does exist
		// if(_thisDevice === 'undefined' || _thisDevice === undefined || _thisDevice === '' || !_thisDevice ){//Does not exist

		// 	//Fade in modal to instruct user to name this device
		// 	$('#nameDeviceModal').fadeIn();


		// 	//**Check user module for new device ajax call


		// 	// //Set device on new device creation
		// 	// $(document).on('reloadDevices', function(event){

		// 	// 	//Fade in modal to instruct user to name this device
		// 	// 	$('#nameDeviceModal').fadeOut();

		// 	// 	//Set this device once a new one is created
		// 	// 	_thisDevice = event.newDeviceId;

		// 	// 	// //Set a device cookie for socket server control
		// 	// 	// document.cookie = "device=" + _thisDevice;

		// 	// });//on reloadDevices
		// }









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
		var name 				= $('.infoDeviceName').val();
		var selectedDeviceName 	= $('#userDevices option:selected').text();
		var selectedDeviceId 	= $('#userDevices option:selected').attr('data-id');
		var deviceCookieAmount 	= _devices.length;


		//USER CHOSE A DEVICE NAME FROM LIST
		if(selectedDeviceName !== 'Your Devices' && name === ''){

			 //set cookie DEVICE# with device id here
			document.cookie = 'device' + (deviceCookieAmount + 1) + '=' + selectedDeviceId;
			$('#nameDeviceModal').fadeOut();

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

					$('#nameDeviceModal').fadeOut();

				}//success
			});//ajax
		}//else

		// //If a device name already exists for this device, get it
		// if(!$('#infoDeviceName').attr('data-id') === ''){

		// 	 currentDeviceId = $('.infoDeviceName').attr('data-id');

		// }
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













// })(window, document, jQuery);
});//define()
})();//function