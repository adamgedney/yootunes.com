(function(){
define(['jquery', 'getCookies'], function($, getCookies){


// var User = (function(window, document, $){



	//instances


	//private vars
	var _baseUrl 	= 'http://yooapi.pw';
	var _userId;
	var _devices 	= [];
	var _thisDevice;

	var obj 		= {};










	//constructor function
	// var user = function(){


		//retrieve device array from service
		_devices = getCookies.devices;


		//If device cookie doesn't/does exist
		if(_thisDevice === 'undefined' || _thisDevice === undefined || _thisDevice === '' || !_thisDevice ){//Does not exist

			//Fade in modal to instruct user to name this device
			$('#nameDeviceModal').fadeIn();


			//**Check user module for new device ajax call


			// //Set device on new device creation
			// $(document).on('reloadDevices', function(event){

			// 	//Fade in modal to instruct user to name this device
			// 	$('#nameDeviceModal').fadeOut();

			// 	//Set this device once a new one is created
			// 	_thisDevice = event.newDeviceId;

			// 	// //Set a device cookie for socket server control
			// 	// document.cookie = "device=" + _thisDevice;

			// });//on reloadDevices
		}









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



			var currentDeviceId = "0";//default
			var name 			= $('.infoDeviceName').val();



			//If a device name already exists for this device, get it
			if(!$('#infoDeviceName').attr('data-id') === ''){

				 currentDeviceId = $('.infoDeviceName').attr('data-id');

			}


			//Build API URL
			var API_URL = _baseUrl + '/device/' + _userId + '/' + name + '/' + currentDeviceId;

			//Call API to set new device or update current device
			$.ajax({
				url : API_URL,
				method : 'GET',
				dataType : 'json',
				success : function(response){

					//Fires a complete event after  device has been added
					//Picked up in content controller
					$(document).trigger({
						type 		: 'reloadDevices',
						newDeviceId 	: response.newDeviceId,
						newDeviceName 	: response.newDeviceName
					});

					//Set a device cookie for socket server control
					document.cookie = "device=" + response.newDeviceId;
				}//success
			});//ajax
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
	obj.getDevices 	= getDevices,
	obj.getUser 	= getUser;




	//return object
	return obj;









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