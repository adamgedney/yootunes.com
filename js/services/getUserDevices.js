(function(){
define(['jquery'], function($){



//GET ALL USER DEVICES Service============//

	var _baseUrl 	= 'http://api.atomplayer.com';
	var obj 		= {};
		obj.get  	= getDevices;


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
		}//getDevices



	return obj;






});//define()
})();//function