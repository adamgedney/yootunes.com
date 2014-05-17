(function(){
define(['jquery'], function($){


	var _sort 			= {};
		_sort.ul 		= '';
		_sort.li 		= '';
		_sort.sortOn 	= '';




		$(document).on('rendered', function(event){

			//ON LIBRARY RENDER Set sortable content========================//
			if(event.template === '#libraryItem'){

				//Register sortable elements on DOM
				_sort.ul = '#libraryWrapper';
				_sort.li = '#libraryWrapper li.resultItems';
			}
		});




		//Library list sort interaction=========//
		$(document).on('click', '.viewSongs, .viewArtists, .viewAlbums, .viewGenres', function(event){

			if(window.state !== 'library'){
				loadLibrary();
			}else if(window.state === 'library' && $(this).hasClass('viewSongs')){
				var sortOn = 'span.li-col2';
			}else if(window.state === 'library' && $(this).hasClass('viewArtists')){
				var sortOn = 'span.li-col3';
			}else if(window.state === 'library' && $(this).hasClass('viewAlbums')){
				var sortOn = 'span.li-col4';
			}else if(window.state === 'library' && $(this).hasClass('viewGenres')){
				var sortOn = 'span.li-col5';
			}

			sortContent(_sort.ul, _sort.li, sortOn);
		});







		//Header sort interaction=========//
		$(document).on('click', '.mainViewSongs, .mainViewArtists, .mainViewAlbums, .mainViewGenres', function(event){

				if($(this).hasClass('mainViewSongs')){
					var sortOn 	= 'span.li-col2';
				}else if($(this).hasClass('mainViewArtists')){
					var sortOn 	= 'span.li-col3';
				}else if($(this).hasClass('mainViewAlbums')){
					var sortOn 	= 'span.li-col4';
				}else if($(this).hasClass('mainViewGenres')){
					var sortOn 	= 'span.li-col5';
				}

				sortContent(_sort.ul, _sort.li, sortOn);
		});







	//Player screensize functions=======//
	//Controls entering fullscreen iframe manipulation
	var sortContent = function(ul, li, sortOn){
		this.toggle;

		function asc_sort(a, b){
			return ($(b).find(sortOn).text()) < ($(a).find(sortOn).text()) ? 1 : -1;
		}

		function dec_sort(a, b){
			return ($(b).find(sortOn).text()) < ($(a).find(sortOn).text()) ? -1 : 1;
		}

			if(this.toggle){

				$(ul).html($(li).sort(asc_sort));


				this.toggle = !this.toggle;

			}else{

				$(ul).html($(li).sort(dec_sort));

				this.toggle = !this.toggle;

			}
	}




	return sortContent;





});//define()
})();//function