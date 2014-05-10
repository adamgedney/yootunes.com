require.config({
	baseUrl : "./js",
	optimize: "none",
	paths 	: {
		jquery 			: 'jquery',
		modernizr 		: 'libs/modernizr',
		Handlebars 		: 'libs/handlebars',
		lightbox 		: 'libs/lightbox-2.6.min',
		parallax 		: 'libs/parallax',
		User 			: 'controllers/user',
		Init 			: 'controllers/init',
		Auth 			: 'controllers/auth',
		Content 		: 'controllers/content',
		Ui 				: 'controllers/ui',
		Library 		: 'controllers/library',
		Player 			: 'controllers/player',
		socketService 	: 'services/socketService',
		getCookies 		: 'services/getCookiesService'
	}
});




// //Instantiate Controllers
require(['modernizr', 'jquery', 'Init', 'Auth', 'Content','Library', 'User', 'Player'],
	function(modernizr, jquery, Init, Auth, Content, Library, User, Player){

		var init 			= new Init();
		var auth 			= new Auth();
		var player 			= new Player();

		//Load async scripts
		Content.loadScripts();

});









