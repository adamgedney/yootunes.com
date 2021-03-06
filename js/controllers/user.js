(function(){
define(['jquery', 'getCookies', 'getUserDevices', 'determineDevice'], function($, getCookies, getUserDevices, determineDevice){


	//private vars
	var _baseUrl 	= 'http://api.atomplayer.com';
	var _userId;
	var _devices 	= [];
	var _thisDevice;








		//=====================================//
		//OPEN NAME DEVICE MODAL
		//=====================================//
		$(document).on('namedevice', function(){


			// Fade in modal to instruct user to name this device
			$('#nameDeviceModal').fadeIn();
			$('#devicePrompt').fadeIn();

			//Maybe user deleted cookies? GET DEVICES TO ASK USER
			getUserDevices.get(userId, function(response){

				//Set for addDevice method
				_devices = response;

				//Instructs Content to render device lists in ui & modal
				$.event.trigger({
					type 			: 'renderdevices',
					response 		: response,
					origin 			: 'indeterminate'
				});
			});//getDevices

		});//namedevice












		//=====================================//
		//NAME DEVICE MODAL HANDLER
		//=====================================//
		$(document).on('click', '#submitDeviceName', function(event){
			event.preventDefault();

			//Ensures userId is always available
			if(_userId === undefined || !_userId || _userId === '' || _userId === null){
				if(window.userId !== undefined){
					_userId = window.userId;
				}else if(getCookies.userId !== undefined){
					_userId = getCookies.userId;
					window.userId = _userId;
				}
			}

			addDevice(_userId);


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


					//Fires a complete event after  device has been deleted
					//Instructs Content to render device lists in ui & modal
					$.event.trigger({
						type 	: 'renderdevices',
						origin 	: 'delete device'
					});


				}//success
			});//ajax
		});//updateDeviceName










		//RENAME DEVICE
		$(document).on('click', '#submitRenameDevice', function(event){
			event.preventDefault();

			var name 		= $('input#renameDeviceName').val();
			var deviceId 	= $(this).parent().find('#renameDeviceName').attr('data-id');
			var API_URL 	= _baseUrl + '/rename-device/' + deviceId + '/' + name;

			//Delete device on deviceId
			$.ajax({
				url : API_URL,
				method : 'GET',
				dataType : 'json',
				success : function(response){


					//Fires a complete event after  device has been deleted
					//Instructs Content to render device lists in ui & modal
					$.event.trigger({
						type 	: 'renderdevices',
						origin 	: 'renamed device'
					});


				}//success
			});//ajax
		});//updateDeviceName






















	// };//constructor
	//=========================//











	//Public methods and properties.
	var exports 		= {
		getUser 		: getUser,
		addDevice 		: addDevice
	};





	//return exports
	return exports;









//================================//
//Class methods===================//
//================================//


	function addDevice(userId){

		//retrieve device array from service
		// _devices = getCookies.devices;

		var currentDeviceId 	= "0";//default set in case we're new and not updating
		var name 				= $('input.infoDeviceName').val();
		var deviceOption 		= $('#userDevices option:selected');
		var selectedDeviceName 	= deviceOption.text();
		var selectedDeviceId 	= deviceOption.attr('data-id');
		var deviceCookieAmount 	= _devices.length;
		var nameDeviceModal 	= $('#nameDeviceModal');


		//USER CHOSE A DEVICE NAME FROM LIST
		if(selectedDeviceName !== 'Your Devices' && name === ''){

			 //set cookie DEVICE# with device id here
			 if(localStorage){
			 	var devStr = 'device' + (deviceCookieAmount + 1) + '';

			 	localStorage.setItem(devStr, selectedDeviceId);
			 }else{
			 	document.cookie = 'device' + (deviceCookieAmount + 1) + '=' + selectedDeviceId;
			 }

			 //Set global on user choice
			 window.thisDevice = selectedDeviceId;


			//redetermine the device now that we have set user device
			determineDevice(function(data){
				 //Instructs COntent to reload device list
				// $.event.trigger({
				// 	type : 'renderdevices'
				// });
			//determine fires a render event

				nameDeviceModal.fadeOut();
			});

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
					if(localStorage){
					 	var devStr = 'device' + (deviceCookieAmount + 1) + '';

					 	localStorage.setItem(devStr, response.newDeviceId);
					 }else{
					 	document.cookie = 'device' + (deviceCookieAmount + 1) + '=' + response.newDeviceId;
					 }


					 //set new device ID on global
					 window.thisDevice = response.newDeviceId;

					//redetermine the device now that we have set user device
					determineDevice(function(data){
						//Instructs COntent to reload device list
						// $.event.trigger({
						// 	type : 'renderdevices'
						// });
					//determine fries render event



						nameDeviceModal.fadeOut();
					});

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


				//Set a cookie in the browser to store user id
				//Duplicate setting. Just for stability.
				window.userId 	= response[0].id;

				if(localStorage){
					localStorage.setItem('uid', response[0].id);
				}else{
					document.cookie = "uid=" + response[0].id;
				}


				//Callback once data received
				if(typeof callback === "function"){

					callback(response);
				}
			}//success
		});//ajax
	}








});//define()
})();//function