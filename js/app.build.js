({
    appDir: "../",
    baseUrl: "./js",
    optimize: "uglify",
    paths:{
    	'jquery' 				: 'jquery',
    	'Handlebars'      		: 'libs/handlebars',
    	'lightbox'				: 'libs/lightbox-2.6.min',
		'User' 					: 'controllers/user',
		'Init' 					: 'controllers/init',
		'Auth' 					: 'controllers/auth',
		'Content' 				: 'controllers/content',
		'Ui' 					: 'controllers/ui',
		'Library' 				: 'controllers/library',
		'Player'				: 'controllers/player',
		'socketService' 		: 'services/socketService',
		'getCookies'		 	: 'services/getCookiesService'
	},
    dir: "../../build",
    modules: [
		{name : 'User'},
		{name : 'Init'},
		{name : 'Auth'},
		{name : 'Content'},
		{name : 'Ui'},
		{name : 'Library'},
		{name : 'Player'},
		{name : 'socketService'},
		{name : 'getCookies'}
    ]
})
