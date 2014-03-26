(function(window, document, $){

//Application globals==========//
var app 		= {};
	app.ads 	= new Ads(),
	app.content = new Content(),
	app.library = new Library(),
	app.log 	= new Log(),
	app.player 	= new Player(),
	app.user 	= new User(),
	app.ui 		= new Ui();




//URI reference=============//
app.route 			= {},
app.route.protocol 	= window.location.protocol,
app.route.host 		= window.location.host,
app.route.path 		= window.location.pathname;



//initializes application
init();



//init functions
function init(){
	$('.playlist-dropdown').hide();
	$('li.main-dropdown').hide();
}

})(window, document, jQuery);