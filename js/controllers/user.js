var User = (function(window, document, $){



	//instances


	//private vars
	var _baseUrl 	= 'http://localhost:8887';
	var _userId;
	var _thisDevice;











	//constructor function
	var user = function(){


		//Retrieve cookies & set device & userId
		var userCookies = getCookies();
			_thisDevice = userCookies.thisDevice;
			_userId 	= userCookies.userId;



			console.log(app.content, "app content");










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
		constructor : user,
		getCookies 	: getCookies
	};











	//return constructor
	return user;









//================================//
//Class methods===================//
//================================//




	function setDeviceCookie(deviceId){

		//Set a device cookie for socket server control
		document.cookie = "device=" + deviceId;
	}





	function getCookies(){

		var obj = {
			'userId' 	: _userId,
			'thisDevice': _thisDevice
		};


		//Check for the stored cookie in the browser
		var cookie = document.cookie;
		var cookieArray = cookie.split("; ");

		//loop through cookie array
		for(var c=0;c<cookieArray.length;c++){

			//Retrieve userid cookie
			if(cookieArray[c].indexOf("uid") !== -1){

				//Set Class level userId
				obj.userId = cookieArray[c].substr(4);
			}


			//Retrieve user device cookie
			if(cookieArray[c].indexOf("device") !== -1){

				//Set class level device id
				obj.thisDevice = cookieArray[c].substr(7);
			}
		}//for

		return obj;
	}














})(window, document, jQuery);
