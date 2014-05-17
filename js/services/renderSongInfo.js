(function(){
define(['jquery'], function($){


	var renderSongInfo = function(id){

		//Commented out thumb code loads a youtube thumb into the footer info section
		var playing 			= $('span.play-icon[data-videoId=' + id + ']');
		// var thumb 				= $('img#infoThumb');
		// var lbThumb 			= $('a#lbThumb');
		var song 				= $('#infoTitle');
		var artist 				= $('#infoArtist');
		var album 				= $('#infoAlbum');
		var dataSong 			= playing.attr('data-song');
		var dataArtist 			= playing.attr('data-artist');
		var dataAlbum 			= playing.attr('data-album');
		var fbShareMain 		= $('#fbShareMain');
		var googleShareMain 	= $('#googleShareMain');
		var twitterShareMain 	= $('#twitterShareMain');
		var linkShareMain 		= $('#linkShareMain');
		var youtubeUrl 			= 'https://www.youtube.com/watch?v=' + id;
		// var thumbSrc 		= 'https://i.ytimg.com/vi/' + id + '/default.jpg';
		// var thumbHiSrc 		= 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
		var playingSongId 		= $('span.play-icon[data-videoId=' + id + ']').attr('data-id');

		// thumb.attr('src', thumbSrc);
		// lbThumb.attr('data-lightbox', thumbHiSrc);
		// lbThumb.attr('href', thumbHiSrc);
		song.html(dataSong);
		artist.html(dataArtist);
		album.html(dataAlbum);
		fbShareMain.attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + youtubeUrl).attr('data-id', playingSongId);
		googleShareMain.attr('href', 'https://plus.google.com/share?url=' + youtubeUrl).attr('data-id', playingSongId);
		twitterShareMain.attr('href', 'https://twitter.com/home?status=' + youtubeUrl).attr('data-id', playingSongId);
		linkShareMain.attr('href', youtubeUrl).data('id', playingSongId);

	}


	return renderSongInfo;



});//define()
})();//function