(function(){
define(['jquery', 'getCookies'], function($, getCookies){


// var User = (function(window, document, $){



	//instances


	//private vars
	var _baseUrl 	= 'http://yooapi.pw';
	var _userId;
	var _thisDevice;











	//constructor function
	var user = function(){




// 		//If device cookie doesn't/does exist
// 		if(_thisDevice === undefined){//Does not exist

// 			//Fade in modal to instruct user to name this device
// 			$('#nameDeviceModal').fadeIn();
// console.log(_thisDevice, "this device user js");

// 			//Set device on new device creation
// 			$(document).on('reloadDevices', function(event){
// 				console.log(event.newDeviceId, "reload picked up in user");

// 				//Fade in modal to instruct user to name this device
// 				$('#nameDeviceModal').fadeOut();

// 				//Set this device once a new one is created
// 				_thisDevice = event.newDeviceId;

// 				//Set a device cookie for socket server control
// 				document.cookie = "device=" + _thisDevice;

// 			});//on reloadDevices
// 		}









		//Name this device
		$(document).on('click', '#submitDeviceName', function(event){
			event.preventDefault();

			//Retrieve cookies & set device & userId
			var userCookies = getCookies;

			// _thisDevice = userCookies.thisDevice;
			_userId = userCookies.userId;


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

					console.log(response, "new device response");

					//Fires a complete event after  device has been added
					$(document).trigger({
						type 		: 'reloadDevices',
						newDeviceId 	: response.newDeviceId,
						newDeviceName 	: response.newDeviceName
					});
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










	};//constructor
	//=========================//











	//methods and properties.
	user.prototype = {
		constructor : user
	};











	//return constructor
	return user;









//================================//
//Class methods===================//
//================================//


















// })(window, document, jQuery);
});//define()
})();//function