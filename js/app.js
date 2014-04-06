(function(window, document, $){

	//Instances==========//
	var _app 			= {};
		_app.ads 		= new Ads(),
		_app.content 	= new Content(),
		_app.library 	= new Library(),
		_app.log 		= new Log(),
		_app.player 	= new Player(),
		_app.user 		= new User(),
		_app.ui 		= new Ui();




		//URI reference=============//
		_app.route 				= {},
		_app.route.protocol 	= window.location.protocol,
		_app.route.host 		= window.location.host,
		_app.route.path 		= window.location.pathname;




	//initializes application
	init();






//================================//
//Class methods===================//
//================================//






	//init functions
	function init(){



		//Load app template
		_app.content.loadLanding();




	}//init




































})(window, document, jQuery);