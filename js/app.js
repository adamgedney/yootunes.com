//=================================//
//ATOMPLAYER APP FLOW
//=================================//
//
//APP.JS** loads requirejs configuration and requires libs, init, auth,
//content, library, user, & player controllers as dependencies
//An instance is made for init, auth, and player to kick off the app.
//
//INIT** runs first looking for cookies to see if the session exists. It also
//loads socketservice as a dependency & checks to see if the user's library count has changed
//to determine if we use localstorage or an ajax call to retrieve library.
//Init also determine what device the user is using.
//
//AUTH** handles all user authentication interactions. -login, logout, forgot password, create user, & acct settings page
//update info. This is where socketio room is created. <-- near line 641 as of this writing
//Auth also sets cookies and global vars for user
//
//USER** handles setting and deleting user devices and getting user data
//
//CONTENT** handles TEMPLATING and rendering mainly. Loading of library, playlists, songs, sorting,
//querying, search history, device rendering, acct settings page loading,
//
//LIBRARY** handles interactions with library and playlists. CRUD & minor ui., library & playlist -add/remove songs etc.
//shared playlist handling.
//
//PLAYER** handles all player funcitonality. Connects to youtube player API (or inserts iframe for mobile devs),
//determines when to emit socket events or play locally, handles socket events for remote playing,
//handles shuffle -loop -volume -seek/time -transport. Handles on play ui changes & interactions,
//
//UI** handles user interface interactions, playlist drag&drop, a lot of show/hides, button toggles,
//mouse events, menus, seek bar movements, screen sizes, themeing, ad show/hide, youtube image loading.
//
//THE DATA API exists at api.atomplayer.com. -PHP/Laravel/MySQL
//THE SOCKET SERVER exists at ss.atomplayer.com -NodeJS/Express/Socket.io




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
require(['modernizr', 'jquery', 'Init', 'Auth', 'User', 'Content','Library', 'Player'],
	function(modernizr, jquery, Init, Auth, User, Content, Library, Player){

		var init 			= new Init();
		var auth 			= new Auth();
		var player 			= new Player();

		//Load async scripts
		Content.loadScripts();

});









