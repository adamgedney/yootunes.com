require.config({
	baseUrl : "./js",
	optimize: "none",
	paths 	: {
		jquery 		: 'libs/jquery',
		modernizr 	: 'libs/modernizr',
		Handlebars 	: 'libs/handlebars',
		socketio 	: 'http://yooss.pw:3998/socket.io/socket.io',
		Login 		: 'controllers/login',
		Content 	: 'controllers/content',
		Ui 			: 'controllers/ui',
		Library 	: 'controllers/library',
		Player 		: 'controllers/player',
		User 		: 'controllers/user',
		getCookies 	: 'services/getCookiesService'
	}
});

// packages 		: [
// 		{
// 			name : 'jquery',
// 			location : 'libs/',
// 			main : 'jquery'
// 		}
// 	]


// //Instantiate Controllers
require(['Login', 'Content', 'Ui', 'Library', 'Player', 'User'], function(Login, Content, Ui, Library, Player, User){
	var login = new Login();
	var vontent = new Content();
	var ui = new Ui();
	var library = new Library();
	var player = new Player();
	var user = new User();
});


// // 'Ui', 'Library', 'Player', 'User'
// //  Ui, Library, Player, User

