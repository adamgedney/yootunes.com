(function(){
define(['jquery'], function($){








	var activeLibraryItem = function(active){


		var songs 		= $('li.viewSongs');
		var artists 	= $('li.viewArtists');
		var albums 		= $('li.viewAlbums');
		var genres 		= $('li.viewGenres');
		var settings 	= $('#acctSettings');
		var playlists 	= $('a.playlistTitle');

		var songsA 		= songs.find('a');
		var artistsA	= artists.find('a');
		var albumsA 	= albums.find('a');
		var genresA 	= genres.find('a');
		var settingsA 	= settings.find('a');


			if('li' + active === songs.selector){
				songsA.addClass('red');
				songs.addClass('red');

				artists.removeClass('red');
				albums.removeClass('red');
				genres.removeClass('red');
				artistsA.removeClass('red');
				albumsA.removeClass('red');
				genresA.removeClass('red');
				settingsA.removeClass('red');
				playlists.removeClass('red');

			}else if('li' + active === artists.selector){
				artistsA.addClass('red');
				artists.addClass('red');

				songs.removeClass('red');
				albums.removeClass('red');
				genres.removeClass('red');
				songsA.removeClass('red');
				albumsA.removeClass('red');
				genresA.removeClass('red');
				settingsA.removeClass('red');
				playlists.removeClass('red');

			}else if('li' + active === albums.selector){
				albumsA.addClass('red');
				albums.addClass('red');

				artists.removeClass('red');
				songs.removeClass('red');
				genres.removeClass('red');
				songsA.removeClass('red');
				artistsA.removeClass('red');
				genresA.removeClass('red');
				settingsA.removeClass('red');
				playlists.removeClass('red');

			}else if('li' + active === genres.selector){
				genresA.addClass('red');
				genres.addClass('red');

				artists.removeClass('red');
				albums.removeClass('red');
				songs.removeClass('red');
				songsA.removeClass('red');
				artistsA.removeClass('red');
				albumsA.removeClass('red');
				settingsA.removeClass('red');
				playlists.removeClass('red');

			}else if(active === settings.selector){
				settingsA.addClass('red');

				artists.removeClass('red');
				albums.removeClass('red');
				songs.removeClass('red');
				genres.removeClass('red');
				songsA.removeClass('red');
				artistsA.removeClass('red');
				albumsA.removeClass('red');
				genresA.removeClass('red');
				playlists.removeClass('red');

			}else{//if active is a playlist id

				playlists.removeClass('red');
				$('a.playlistTitle[data-id=' + active + ']').addClass('red');

				artists.removeClass('red');
				albums.removeClass('red');
				songs.removeClass('red');
				genres.removeClass('red');
				songsA.removeClass('red');
				artistsA.removeClass('red');
				albumsA.removeClass('red');
				genresA.removeClass('red');
				settingsA.removeClass('red');
			}
	}




	return activeLibraryItem;





});//define()
})();//function