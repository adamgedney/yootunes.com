(function(window, document, $){

	//Instances==========//
	var _app 			= {};
		_app.ads 		= new Ads(),
		_app.content 	= new Content(),
		_app.library 	= new Library(),
		_app.log 		= new Log(),
		_app.player 	= new Player(),
		_app.user 		= new User(),
		_app.ui 		= new Ui();




		//URI reference=============//
		_app.route 				= {},
		_app.route.protocol 	= window.location.protocol,
		_app.route.host 		= window.location.host,
		_app.route.path 		= window.location.pathname;




	//initializes application
	init();






//================================//
//Class methods===================//
//================================//






	//init functions
	function init(){

		//Loads any scripts needing dynamic insertion
		loadScripts();

		//Load app template
		_app.content.loadLanding();

		//Makes synchronous
		//Listens for loadApp content renderer complete
		$(document).on('rendered', function(event){

			if(event.template === '#app'){

				//Load playlists
				_app.content.loadPlaylists();

				//Load library items
				_app.content.loadLibrary();



				//Listens for library renderer complete
				$(document).on('rendered', function(event){

					if(event.template === '#libraryItem'){

						//replaces SVGs in DOM w/ inline SVG
						replaceSVG();

						//Hide DOM nodes
						hideNodes();
					}
				});//onRendered

			}
		});//onRendered
		//End Synchronous






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








	//Maintains list of DOM nodes to hide on app init
	function hideNodes(){

		var selectors = ['.playlist-dropdown', 'li.main-dropdown',
		'.add-to-playlist-menu', '.improve-meta-sub-menu'];

		for(var i=0; i<selectors.length;i++){
			$(selectors[i]).hide();
		}
	}








	//Loads any scripts needing dynamic insertion
	function loadScripts(){

		//Load YouTube Player API scripts
		var tag = document.createElement('script');
			tag.src = "http://www.youtube.com/player_api";

		var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		//End YouTube Player API scripts
	}
















})(window, document, jQuery);