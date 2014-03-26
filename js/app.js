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






//================================//
//Class methods===================//
//================================//






	//init functions
	function init(){

		//replaces SVGs in DOM w/ inline SVG
		replaceSVG();


		//hide nodes list
		$('.playlist-dropdown').hide();
		$('li.main-dropdown').hide();
		$('.add-to-playlist-menu').hide();
		$('.improve-meta-sub-menu').hide();



	}//init











	//Replace all SVG images with inline SVG===//
	//Source: http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
	function replaceSVG(){
		$('img.svg').each(function(){
		    var img = $(this);
		    var imgID = img.attr('id');
		    var imgClass = img.attr('class');
		    var imgURL = img.attr('src');

		    $.get(imgURL, function(data) {
		        // Get the SVG tag, ignore the rest
		        var svg = $(data).find('svg');

		        // Add replaced image's ID to the new SVG
		        if(typeof imgID !== 'undefined') {
		            svg = svg.attr('id', imgID);
		        }
		        // Add replaced image's classes to the new SVG
		        if(typeof imgClass !== 'undefined') {
		            svg = svg.attr('class', imgClass+' replaced-svg');
		        }

		        // Remove any invalid XML tags as per http://validator.w3.org
		        svg = svg.removeAttr('xmlns:a');

		        // Replace image with new SVG
		        img.replaceWith(svg);

		    }, 'xml');
		});
	}//replaceSVG()
















})(window, document, jQuery);