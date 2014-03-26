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
			console.log('it works!');
			return "woohoo";
		}
	};

	//return constructor
	return user;

})(window, document,jQuery);
