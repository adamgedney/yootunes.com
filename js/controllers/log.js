var Log = (function(window, document, $){

	//private vars
	var _foo = 'bar';

	//constructor fuction
	var log = function(){

	};

	//methods and properties.
	log.prototype = {
		constructor  : log
	};

	//return constructor
	return log;

})(window, document,jQuery);
