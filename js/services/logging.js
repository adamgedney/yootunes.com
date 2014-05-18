(function(){
define(['jquery', 'getCookies'], function($, getCookies){



	var _baseUrl = 'http://api.atomplayer.com';
	var _userId;






	var logLogin = function(){

		ensureUserExists();

		var API_URL = _baseUrl + '/log-login/' + _userId;

		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType	: 'json',
			success 	: function(response){
				console.log(response);
			}//success
		});//ajax
	}










	var logLogout = function(){

		ensureUserExists();

		var API_URL = _baseUrl + '/log-logout/' + _userId;

		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType	: 'json',
			success 	: function(response){
				console.log(response);
			}//success
		});//ajax
	}










	var logLoginFromSignup = function(){

		ensureUserExists();

		var API_URL = _baseUrl + '/log-login-from-signup/' + _userId;

		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType	: 'json',
			success 	: function(response){
				console.log(response);
			}//success
		});//ajax
	}









	var logPlay = function(songId, lastPlaylist){

		ensureUserExists();

		//Build according to state
		if(window.state === 'playlist' && lastPlaylist !== window.currentPlaylist){
			var API_URL = _baseUrl + '/log-playlist-play/' + _userId + '/' + window.currentPlaylist;

			lastPlaylist = window.currentPlaylist;
		}else{
			var API_URL = _baseUrl + '/log-song-play/' + _userId + '/' + songId;
		}


		$.ajax({
			url 		: API_URL,
			method 		: 'GET',
			dataType	: 'json',
			success 	: function(response){
				console.log(response);
			}//success
		});//ajax
	}//log













	var logPlaylistShare = function(userId, playlistId){

		var API_URL = _baseUrl + '/log-shared-playlist/' + userId + '/' + playlistId;

			$.ajax({
				url 		: API_URL,
				method 		: 'GET',
				dataType	: 'json',
				success 	: function(response){
					console.log(response);
				}//success
			});//ajax
	}












	function ensureUserExists(){
		//Ensures userId is always available
		if(_userId === undefined || !_userId || _userId === '' || _userId === null){
			if(window.userId !== undefined){
				_userId = window.userId;
			}else if(getCookies.userId !== undefined){
				_userId = getCookies.userId;
			}
		}
	}












	var logging = {
		logLogin 			: logLogin,
		logLogout 			: logLogout,
		logLoginFromSignup 	: logLoginFromSignup,
		logPlay 			: logPlay,
		logPlaylistShare 	: logPlaylistShare

	};


	return logging;






});//define()
})();//function