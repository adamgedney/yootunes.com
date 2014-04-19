var User = (function(window, document, $){



	//instances


	//private vars
	var _baseUrl 	= 'http://localhost:8887';
	var _userId;
	var _thisDevice;











	//constructor function
	var user = function(){


		//Retrieve cookies & set device & userId
		var userCookies = app.getCookies;

			_thisDevice = userCookies.thisDevice;
			_userId 	= userCookies.userId;





console.log(_thisDevice, _userId, "app.content in user");








		//Name this device
		$(document).on('click', '#submitDeviceName', function(event){
			event.preventDefault();

			var currentDeviceId = "0";//default
			var name 		= $('#infoDeviceName').val();



			//If a device name already exists for this device, get it
			if(!$('#infoDeviceName').attr('data-id') === ''){

				 currentDeviceId = $('#infoDeviceName').attr('data-id');

			}


			//Build API URL
			var API_URL = _baseUrl + '/device/' + _userId + '/' + name + '/' + currentDeviceId;

			//Call API to set new device or update current device
			$.ajax({
				url : API_URL,
				method : 'GET',
				dataType : 'json',
				success : function(response){
					console.log(response, "device response");

					//Fires a complete event after  device has been added
					$(document).trigger({
						type : 'reloadDevices'
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


















})(window, document, jQuery);
