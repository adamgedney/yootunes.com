var User = (function(window, document, $){

	//private vars
	var _foo = 'bar';

	//constructor function
	var user = function(){

	};

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

})(window, document,jQuery);
