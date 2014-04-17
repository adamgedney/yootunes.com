var User = (function(window, document, $){



	//instances


	//private vars
	var _baseUrl 	= 'http://localhost:8887';
	var _userId 	= '';











	//constructor function
	var user = function(){

		//When instance loads, listen for user to sign in then store id
		$(document).on('userLoggedIn', function(event){
			_userId = event.userId;
		});














		//Name this device
		$(document).on('click', '#updateDeviceName', function(event){
			event.preventDefault();

			var name 	= $('#infoDeviceName').val();
				_userId = $('#infoId').html();

			var API_URL = _baseUrl + '/new-device/' + _userId + '/' + name;

			$.ajax({
				url : API_URL,
				method : 'GET',
				dataType : 'json',
				success : function(response){
					console.log(response, "new device name response");


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
						type		: 'deviceDeleted'
					});


				}//success
			});//ajax
		});//updateDeviceName










	};//constructor
	//=========================//











	//methods and properties.
	user.prototype = {
		constructor : user,
		getUser 	: function(){
			var obj = {
				name: 'adam',
				email : 'adam.gedney@gmail.com',
				tel : '845.216.5030'
			}
			return obj;
		}
	};











	//return constructor
	return user;









//================================//
//Class methods===================//
//================================//











})(window, document, jQuery);
