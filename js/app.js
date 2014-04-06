(function(window, document, $){

	//Instances==========//
	var _app 			= {};
		// _app.ads 		= new Ads(),
		_app.content 	= new Content();
		_app.library 	= new Library(),
		// _app.log 		= new Log(),
		_app.player 	= new Player(),
		_app.user 		= new User(),
		_app.ui 		= new Ui();




		//URI reference=============//
		// _app.route 				= {},
		// _app.route.protocol 	= window.location.protocol,
		// _app.route.host 		= window.location.host,
		// _app.route.path 		= window.location.pathname;




	//initializes application
	init();






//================================//
//Class methods===================//
//================================//






	//init functions
	function init(){

		//Check for the stored cookie in the browser
		var cookie = document.cookie;
		var userId = cookie.slice(4);

		if(userId !== "" || userId !== undefined || userId !== null){

			//Load app template
			_app.content.loadApp();

			//fire event passing user data to listening class
			$.event.trigger({
				type 	: 'userloggedin',
				userId	: userId
			});

		}else{
			//Load app template
			_app.content.loadLanding();
		}






	}//init




































})(window, document, jQuery);