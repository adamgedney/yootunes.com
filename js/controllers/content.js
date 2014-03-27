//Content is essentially a view controller
var Content = (function(window, document, $){

	//Instances
	var _library 	= new Library();
	var _user		= new User();


	//private vars
	// var _foo = 'bar';




	//constructor method
	var content = function(){

	};//constructor function
	//================================//




	//methods and properties.
	content.prototype = {
		constructor 	: content,
		loadApp 		: loadApp,
		loadPlaylists	: loadPlaylists,
		loadLibrary 	: loadLibrary
	};





	//return constructor
	return content;









//================================//
//Class methods===================//
//================================//

	//Loads app template
	function loadApp(){
		var src 		= '/js/views/app.html',
			id 			= '#app',
			appendTo 	= '#appWrapper';

			data 	 	= {
				test	: ''
			};


		render(src, id, appendTo, data);
	}









	//Gets data & Loads playlist template
	function loadPlaylists(){
		var src 		= '/js/views/playlist.html',
			id 			= '#playlist',
			appendTo 	= '#playlistWrapper';

			data 	 	= {
				test	: ''
			};


		render(src, id, appendTo, data);
	}









	//Gets data & Loads library template
	function loadLibrary(){
		var src 		= '/js/views/library.html',
			id 			= '#libraryItem',
			appendTo 	= '#libraryWrapper';

			data 	 	= {
				song	: [{id: '0', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'http://images.gs-cdn.net/static/albums/120_124599.jpg', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '1', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'http://images.gs-cdn.net/static/albums/120_124599.jpg', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '2', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'http://images.gs-cdn.net/static/albums/120_124599.jpg', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '3', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'http://images.gs-cdn.net/static/albums/120_124599.jpg', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},]
			};

			render(src, id, appendTo, data);
	}









	function render(src, id, appendTo, data){

		$.get(src, function(htmlArg){

			//Finds and populates template
			var source 		= $(htmlArg).find(id).html();
			var template 	= Handlebars.compile(source);
			var html 		= template(data);



			//Appends template into Wrapper on DOM
			$(appendTo).append(html);


			//Fires a complete event after content has been appended
			$.event.trigger({
				type		: 'rendered',
				template 	: id
			});

		});
	}



















})(window, document,jQuery);
