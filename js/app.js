require.config({
	baseUrl : "./js",
	optimize: "none",
	paths 	: {
		jquery 			: 'libs/jquery',
		modernizr 		: 'libs/modernizr',
		Handlebars 		: 'libs/handlebars',
		lightbox 		: 'libs/lightbox-2.6.min',
		// io 			: 'http://yooss.pw:41795/socket.io/socket.io',
		Init 			: 'controllers/init',
		Auth 			: 'controllers/auth',
		Content 		: 'controllers/content',
		Ui 				: 'controllers/ui',
		Library 		: 'controllers/library',
		Player 			: 'controllers/player',
		User 			: 'controllers/user',
		socketService 	: 'services/socketService',
		getCookies 		: 'services/getCookiesService'
	}
});

// packages 		: [
// 		{
// 			name : 'jquery',
// 			location : 'libs/',
// 			main : 'jquery'
// 		}
// 	]

	// socketio 	: 'http://yooss.pw:41795/socket.io/socket.io',


// //Instantiate Controllers
require(['jquery','Init', 'Auth', 'Content', 'Ui', 'Library', 'Player', 'User', 'lightbox'],
	function(jquery, Init, Auth, Content, Ui, Library, Player, User, lightbox){

		var init 			= new Init();
		var auth 			= new Auth();
		var ui 				= new Ui();
		var player 			= new Player();

		//Load async scripts
		Content.loadScripts();

});


// // 'Ui', 'Library', 'Player', 'User'
// //  Ui, Library, Player, User

