(function(){
define(['jquery'], function($){




// var Library = (function(window, document, $){

	//private vars
	var DOM 			= {};
	var _addedToLibrary = false;
	var _libraryId 		= '';
	var _visibleFormId 	= '';

	var _baseUrl 		= 'http://api.yootunes.com';














		//Listen for rendered to register DOM elements
		$(document).on('rendered', function(event){
			registerDOM(event.template);

			if(event.template === '#playlist'){


				//Rename playlist
				$(document).on('dblclick', '.playlistTitle', function(event){
					var playlistId 	= $(this).attr('data-id');
					_visibleFormId 	= playlistId;
					var form 		= $('form.renamePlaylistForm[data-id=' + playlistId + ']');
					var input 		= $('input.renamePlaylistInput[data-id=' + playlistId + ']');

					$('form.renamePlaylistForm').attr('id', 'renameHide');
					form.attr('id', 'renameShow');
					input.val($(this).text());


				});//dbl click
			}//#app
		});//rendered




		//Rename playlist submit
		$(document).on('click', '.renamePlaylistSubmit', function(event){
			event.preventDefault();

			var playlistId 	= $(this).attr('data-id');
			var form 		= $('form.renamePlaylistForm[data-id=' + playlistId + ']');
			var input 		= $('input.renamePlaylistInput[data-id=' + playlistId + ']');
			var newName 	= input.val();


			renamePlaylist(playlistId, newName);

			resetRenameForm();

		});




		//ON FORM MOUSEOUT
		$(document).on('click', '.li-playlist',function(event){
			var playlistId 	= $(this).attr('data-id');

			if($(this).attr('data-id') !== _visibleFormId){
				resetRenameForm();
			}

		});










		//Add/Remove song to/from library========//
		$(document).on('click', '.addToLibrary', function(event){
			var id = $(this).attr('data-id');
			var libraryId = $(this).attr('data-libid');
			var playlistId = $(this).attr('data-playlistId');
			var check = $(this).find('.add-icon').attr('src', 'images/icons/check.png');


			//Currently displaying playlist if playlistId exists
			if(playlistId !== ""){

				//DELETES song from playlist
				deleteSongFromPlaylist(id, playlistId);

			}else{//NOT currently displayling a playlist

				this.toggle;



				//Ensures add song run if library check mark
				if(check){
					this.toggle = this.toggle;
				}

				//Check to see if library id exists. If not, then this is a search result list
				//Ensure click adds to library via this.toggle true
				if(!libraryId || libraryId == " " || libraryId == null || libraryId == undefined){
					this.toggle = !this.toggle;
				}




				//Handles adding and removing functions and check/plus button image swap
				if(this.toggle){

					//retrieve clicked song user id
					var userId = $(this).attr('data-user');

					//Mark song in result list as "in library"
					$(this).attr('data-in-library', 'true');

					//Adds song to library
					addSongToLibrary(id, userId);



					//Swaps out icon
					$(this).find('.add-icon').attr('src', 'images/icons/check.png');

					this.toggle = !this.toggle;



				}else{//Remove song from library



					//retrieve clicked song user id
					var userId = $(this).attr('data-user');

					//Mark song in result list as "in library"
					$(this).attr('data-in-library', 'false');

					//Removes song fom library
					removeSongFromLibrary(id, userId);


					//Swaps out icon
					$(this).find('.add-icon').attr('src', 'images/icons/add.png');

					this.toggle = !this.toggle;
				}//this.toggle
			}//if playlistId
		});//on click








		//Create new playlist form
		$(document).on('click', '.newPlaylistSubmit', function(event){

			var userId 			= $(this).attr('data-user');
			var songId 			= $(this).attr('data-id');
			var playlistName 	= $(this).prev().val();//Previous li sibling in form = text input

			if(songId === ''){
				songId = 0;
			}
			createNewPlaylist(userId, songId, playlistName);

			//Clear form on submit
			DOM.newPlaylistInput.val('');

			event.preventDefault();
		});









		//Add song to playlist
		$(document).on('click', '.playlist-menu-sub-list', function(event){
			var songId 		= $(this).parent().attr('data-id');
			var playlistId 	= $(this).attr('data-playlistId');
			var userId 		= $(this).attr('data-user');
			var that 		= $(this);


			//Show checkmark affordance when song added
			var thisCheck = $(this).find('.addedToPlaylistCheck');
				thisCheck.fadeIn(100, function(){
					hideCheck(thisCheck);
				});



			//Add song to playlist
			addSongToPlaylist(songId, playlistId, userId);
		});









		//Delete playlist
		$(document).on('click', '.deletePlaylist', function(event){
			var playlistId 	= $(this).attr('data-id');

			deletePlaylist(playlistId);
		});


















//================================//
//End Event Logic=================//
//================================//





	var exports = {
		addSharedPlaylist : addSharedPlaylist
	}

	//return exports
	return exports;


















//================================//
//Class methods===================//
//================================//





	function addSongToLibrary(id, userId){

		//Build API url
		var API_URL = _baseUrl + '/add-to-library/' + id + '/' + userId;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){
console.log(response, "add to lib response");
				if(response === true){
					//Display total songs in library in interface
					var currentNumber = DOM.collectionTotal.html();
					DOM.collectionTotal.html(parseInt(currentNumber) + 1);
				}
			}//success
		});//ajax

		//Notify local storage of library change
		$.event.trigger({
			type : 'libraryChanged'
		});
	}










	function removeSongFromLibrary(id, userId){

		//Build API url
		var API_URL = _baseUrl + '/remove-from-library/' + id + '/' + userId;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

console.log(response, "remove from lib response");
				//hide the item just removed form lib. so library doesn't reload
				$('.resultItems[data-id=' + id + ']').hide();

				//Indicate song was removed in Library songs display in sidebar
				if(response === true){

					//Display total songs in library in interface
					var currentNumber = DOM.collectionTotal.html();
					DOM.collectionTotal.html(parseInt(currentNumber) - 1);
				}

			}//success
		});//ajax

		//Notify local storage of library change
		$.event.trigger({
			type : 'libraryChanged'
		});
	}









	function createNewPlaylist(userId, songId, playlistName){

		userId = window.userId;

		//Build API url
		var API_URL = _baseUrl + '/new-playlist/' + userId + '/' + songId + '/' + playlistName;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				//Dispatches event to application for playlist reloading in content controller
				$.event.trigger({
					type : 'playlistadded'
				});
			}//success
		});//ajax


		//Adds this new song to user's library
		addSongToLibrary(songId, userId);
	}









	function addSharedPlaylist(userId, sharedPlaylistId){


		//Build API url
		var API_URL = _baseUrl + '/add-shared-playlist/' + userId + '/' + sharedPlaylistId;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				console.log(response, "response from add-shared-playlist");
			}//success
		});//ajax
	}









	function addSongToPlaylist(songId, playlistId, userId){

		//Build API url
		var API_URL = _baseUrl + '/add-to-playlist/' + songId + '/' + playlistId;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

			}//success
		});//ajax


		//Adds this new song to user's library
		addSongToLibrary(songId, userId);
	}









	function deleteSongFromPlaylist(songId, playlistId){

		//Build API url
		var API_URL = _baseUrl + '/delete-from-playlist/' + songId + '/' + playlistId;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				//Triggers playlist song deleted to trigger a playlist refresh
				$.event.trigger({
					type 	: 'playlistsongremoved',
					id 		: playlistId
				});
			}//success
		});//ajax


	}









	function deletePlaylist(playlistId){

		//Build API url
		var API_URL = _baseUrl + '/delete-playlist/' + playlistId;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){

				//Triggers playlist added just so a playlist reload occurs
				$.event.trigger({
					type : 'playlistadded'
				});

			}//success
		});//ajax



	}








	function renamePlaylist(playlistId, newName){

		//Build API url
		var API_URL = _baseUrl + '/rename-playlist/' + playlistId + '/' + newName;

		//Call API to add song to library
		$.ajax({
			url : API_URL,
			method : 'GET',
			dataType : 'json',
			success : function(response){
				console.log(response, "new playlist name response");
				//Triggers playlist added just so a playlist reload occurs
				$.event.trigger({
					type : 'playlistadded'
				});

			}//success
		});//ajax



	}








	//Called by the add to playlist submenu interaction
	function hideCheck(thisCheck){
		thisCheck.fadeOut(5000);
	}








	function registerDOM(template){

		if(template === '#app'){
			DOM.collectionTotal 	= $('#collectionTotal');
			DOM.newPlaylistInput 	= $('.newPlaylistInput');

		}//#app

		if(template === '#landing'){

		}//#landing

		if(template === '#forgot'){

		}//#library

		if(template === '#reset'){

		}//#library

		if(template === '#library'){

		}//#library

		if(template === '#playlist'){

		}//#library

		if(template === '#subPlaylist'){

		}//#library

		if(template === '#acctSettings'){

		}//#acctSettings
	}









	function resetRenameForm(){
		//Reset and hide form
		$('input.renamePlaylistInput').val('');
		$('form.renamePlaylistForm').attr('id', 'renameHide');
		_visibleFormId = '';
	}


















});//define()
})();//function