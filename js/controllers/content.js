//Content is essentially a view controller
var Content = (function(window, document, $){

	//Instances
	// var _library 	= new Library();
	// var _user		= new User();


	//private vars
	// var _foo = 'bar';




	//constructor method
	var content = function(){




		//Acct Settings page load interaction=========//
		$(document).on('click', '#acctSettings', function(event){

			loadAcctSettings();
		});




		//Device Settings page load interaction=========//
		$(document).on('click', '#deviceSettings', function(event){

			loadDeviceSettings();
		});




		//Songs library page load interaction=========//
		$(document).on('click', '#viewSongs', function(event){

			loadLibrary();
		});




		//Artists library page load interaction=========//
		$(document).on('click', '#viewArtists', function(event){

			loadLibrary();
		});




		//Albums library page load interaction=========//
		$(document).on('click', '#viewAlbums', function(event){

			loadLibrary();
		});




		//Genres library page load interaction=========//
		$(document).on('click', '#viewGenres', function(event){

			loadLibrary();
		});




		//Playlist page load interaction=========//
		$(document).on('click', '.playlistTitle', function(event){

			//Grabs playlist id for specific loading
			var id = $(this).attr('data-id');
			console.log(id, 'this is the clicked playlist id');

			loadLibrary();
		});




		//Search call and result looping=========//
		$(document).on('submit', '#searchForm', function(event){
			var query = $('#searchInput').val();
			var API_URL = 'http://localhost:8887/search/' + query;

			$.ajax({
				url 		: API_URL,
				method 		: 'GET',
				dataType	: 'json',
				success 	: function(data){

					console.log(data);
				}

			});





			return false;
			event.preventDefault();

		});











	};//constructor function
	//================================//




	//methods and properties.
	content.prototype = {
		constructor 		: content,
		loadApp 			: loadApp,
		loadPlaylists		: loadPlaylists,
		loadLibrary 		: loadLibrary
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

			//Shows column headers
			$('.li-header').show();


		render(src, id, appendTo, data);
	}









	//Gets data & Loads library template
	function loadLibrary(){
		var src 		= '/js/views/library.html',
			id 			= '#libraryItem',
			appendTo 	= '.scroll-container';

			data 	 	= {
				song	: [{id: '0', videoid: 'nAo7SyrTCmY', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'http://img.youtube.com/vi/nAo7SyrTCmY/default.jpg', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '1', videoid: 'idSQ3hSLZ8Q', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '2', videoid: 'idSQ3hSLZ8Q', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '3', videoid: 'idSQ3hSLZ8Q', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '01', videoid: 'idSQ3hSLZ8Q', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '11', videoid: 'idSQ3hSLZ8Q', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '21', videoid: 'idSQ3hSLZ8Q', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '31', videoid: 'idSQ3hSLZ8Q', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '02', videoid: 'idSQ3hSLZ8Q', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '12', videoid: 'idSQ3hSLZ8Q', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '22', videoid: 'idSQ3hSLZ8Q', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '32', videoid: 'idSQ3hSLZ8Q', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '30', videoid: 'idSQ3hSLZ8Q', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '31', videoid: 'idSQ3hSLZ8Q', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '32', videoid: 'idSQ3hSLZ8Q', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '33', videoid: 'idSQ3hSLZ8Q', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '301', videoid: 'idSQ3hSLZ8Q', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '311', videoid: 'idSQ3hSLZ8Q', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '321', videoid: 'idSQ3hSLZ8Q', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '331', videoid: 'idSQ3hSLZ8Q', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '302', videoid: 'idSQ3hSLZ8Q', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin I', genre: 'rock', length: '7:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '312', videoid: 'idSQ3hSLZ8Q', title: 'Red Dog', artist: 'Led Starship', album: 'Led Zeppelin IVVV', genre: 'blues', length: '1:01', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '322', videoid: 'idSQ3hSLZ8Q', title: 'Long Dog', artist: 'Purple Zeppelin', album: 'Led IV', genre: 'folk', length: '3:00', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},
							{id: '332', videoid: 'idSQ3hSLZ8Q', title: 'Big Dog', artist: 'Lead Zebra', album: 'Zeppelin IV', genre: 'country', length: '6:52', desc: 'Lorem ipsum dolor sit amet', thumb: 'https://i1.ytimg.com/vi_webp/x_VHwJWBorA/default.webp', imgFull: 'http://images.gs-cdn.net/static/albums/500_124599.jpg'},]
			};

			//Shows column headers
			$('.li-header').show();

		render(src, id, appendTo, data);
	}









	function loadAcctSettings(){
		var src 		= '/js/views/acctSettings.html',
			id 			= '#acctSettings',
			appendTo 	= '.scroll-container';

			data 	 	= {
				test	: ''
			};

			//Hides column headers
			$('.li-header').hide();

		render(src, id, appendTo, data);
	}









	function loadDeviceSettings(){
		var src 		= '/js/views/deviceSettings.html',
			id 			= '#deviceSettings',
			appendTo 	= '.scroll-container';

			data 	 	= {
				test	: ''
			};

			//Hides column headers
			$('.li-header').hide();

		render(src, id, appendTo, data);
	}










	function render(src, id, appendTo, data){

		$.get(src, function(htmlArg){

			//Finds and populates template
			var source 		= $(htmlArg).find(id).html();
			var template 	= Handlebars.compile(source);
			var html 		= template(data);


			//Clear append container
			$(appendTo).empty();

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
