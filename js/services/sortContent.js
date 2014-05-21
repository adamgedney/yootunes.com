(function(){
define(['jquery', 'activeItem'], function($, activeItem){


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
				$.event.trigger({
					type : 'loadlibrary',
				});
			}else if(window.state === 'library' && $(this).hasClass('viewSongs')){
				var sortOn = 'span.li-col2';
			}else if(window.state === 'library' && $(this).hasClass('viewArtists')){
				var sortOn = 'span.li-col3';
			}else if(window.state === 'library' && $(this).hasClass('viewAlbums')){
				var sortOn = 'span.li-col4';
			}else if(window.state === 'library' && $(this).hasClass('viewGenres')){
				var sortOn = 'span.li-col5';
			}



			//Used to set active item in activeItem service
			if($(this).hasClass('viewSongs')){
				activeItem('.viewSongs');
				var iconTarget = $('.mainViewSongs').find('img.sortIcon');
			}else if($(this).hasClass('viewArtists')){
				activeItem('.viewArtists');
				var iconTarget = $('.mainViewArtists').find('img.sortIcon');
			}else if($(this).hasClass('viewAlbums')){
				activeItem('.viewAlbums');
				var iconTarget = $('.mainViewAlbums').find('img.sortIcon');
			}else if($(this).hasClass('viewGenres')){
				activeItem('.viewGenres');
				var iconTarget = $('.mainViewGenres').find('img.sortIcon');
			}


			sortContent(_sort.ul, _sort.li, sortOn, iconTarget);
		});







		//Header sort interaction=========//
		$(document).on('click', '.mainViewSongs, .mainViewArtists, .mainViewAlbums, .mainViewGenres', function(event){

				if($(this).hasClass('mainViewSongs')){
					var sortOn 	= 'span.li-col2';
					var icon 	= $(this).find('img.sortIcon');
				}else if($(this).hasClass('mainViewArtists')){
					var sortOn 	= 'span.li-col3';
					var icon 	= $(this).find('img.sortIcon');
				}else if($(this).hasClass('mainViewAlbums')){
					var sortOn 	= 'span.li-col4';
					var icon 	= $(this).find('img.sortIcon');
				}else if($(this).hasClass('mainViewGenres')){
					var sortOn 	= 'span.li-col5';
					var icon 	= $(this).find('img.sortIcon');
				}

				sortContent(_sort.ul, _sort.li, sortOn, icon);
		});






	//Player screensize functions=======//
	//Controls entering fullscreen iframe manipulation
	var sortContent = function(ul, li, sortOn, icon){
		this.toggle;

		function asc_sort(a, b){
			return ($(b).find(sortOn).text()) < ($(a).find(sortOn).text()) ? 1 : -1;
		}

		function dec_sort(a, b){
			return ($(b).find(sortOn).text()) < ($(a).find(sortOn).text()) ? -1 : 1;
		}

			if(this.toggle){

				$(ul).html($(li).sort(asc_sort));

				icon.attr('src', 'images/icons/down-arrow-wht.svg');


				this.toggle = !this.toggle;

			}else{

				$(ul).html($(li).sort(dec_sort));

				icon.attr('src', 'images/icons/up-arrow-wht.svg');


				this.toggle = !this.toggle;

			}
	}




	return sortContent;





});//define()
})();//function