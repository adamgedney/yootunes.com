var uiController = (function(window, document, $){

	//private vars
	var _foo = 'bar';

	//constructor fuction
	var uiController = function(){

	};

	//prototype –line up prototyped functions here.
	uiController.prototype = {
		constructor  : uiController,
		someFunct    : function(){

		},
		someProperty : 'foobar'
	};

	//return uiController
	return uiController;

})(window, document,jQuery);
//the below references line 1, the module (Class) itself.
//the module returns the constructor (same as 'Math' in Math.random.  .random is a prototype of Math class)
// var ui = new uiController();