(function(document, window, $){

//Application globals==========//
var app 		= {};
	app.ads 	= new Ads(),
	app.content = new Content(),
	app.library = new Library(),
	app.log 	= new Log(),
	app.player 	= new Player(),
	app.ui 		= new Ui(),
	app.user 	= new User();

console.log(app.user.getUser());



//Routes reference=============//
var route 			= {};
	route.protocol 	= window.location.protocol,
	route.host 		= window.location.host,
	route.path 		= window.location.pathname;




//initializes application
init();



//init functions
function init(){
	$('.playlist-dropdown').hide();
}

})(document, window, jQuery);