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
				playlist: [{id: '0', title: 'Jazz mix'},
							{id: '01', title: 'Blues'},
							{id: '02', title: 'Aphex twin'},
							{id: '03', title: 'Richard James'},
							{id: '04', title: 'Richard David James'},
							{id: '05', title: 'Analogue Bubblebath'},
							{id: '10', title: 'Jazz mix'},
							{id: '101', title: 'Blues'},
							{id: '102', title: 'Aphex twin'},
							{id: '103', title: 'Richard James'},
							{id: '104', title: 'Richard David James'},
							{id: '105', title: 'Analogue Bubblebath'},
							{id: '20', title: 'Jazz mix'},
							{id: '201', title: 'Blues'},
							{id: '202', title: 'Aphex twin'},
							{id: '203', title: 'Richard James'},
							{id: '204', title: 'Richard David James'},
							{id: '205', title: 'Analogue Bubblebath'},
							{id: '30', title: 'Jazz mix'},
							{id: '301', title: 'Blues'},
							{id: '302', title: 'Aphex twin'},
							{id: '303', title: 'Richard James'},
							{id: '304', title: 'Richard David James'},
							{id: '305', title: 'Analogue Bubblebath'},
							{id: '310', title: 'Jazz mix'},
							{id: '3101', title: 'Blues'},
							{id: '3102', title: 'Aphex twin'},
							{id: '3103', title: 'Richard James'},
							{id: '3104', title: 'Richard David James'},
							{id: '3105', title: 'Analogue Bubblebath'},
							{id: '320', title: 'Jazz mix'},
							{id: '3201', title: 'Blues'},
							{id: '3202', title: 'Aphex twin'},
							{id: '3203', title: 'Richard James'},
							{id: '3204', title: 'Richard David James'},
							{id: '3205', title: 'Analogue Bubblebath'}]
			};


		render(src, id, appendTo, data);
	}









	//Gets data & Loads library template
	function loadLibrary(){
		var src 		= '/js/views/library.html',
			id 			= '#libraryItem',
			appendTo 	= '#libraryWrapper';

			data 	 	= {
				song	: [{id: '0', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '1', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '2', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '3', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '01', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '11', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '21', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '31', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '02', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '12', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '22', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '32', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '30', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '31', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '32', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '33', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '301', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '311', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '321', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '331', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '302', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '312', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '322', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '332', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},]
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
