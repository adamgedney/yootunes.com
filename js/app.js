(function(){

var app 		= {};
	app.ads 	= new Ads(),
	app.content = new Content(),
	app.library = new Library(),
	app.log 	= new Log(),
	app.player 	= new Player(),
	app.ui 		= new Ui(),
	app.user 	= new User();

console.log(app.user.getUser());

})();