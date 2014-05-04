(function(){
define(['jquery', 'js/libs/keyHash.js', 'Player', 'getCookies'], function($, Key, Player, getCookies){




// var Ui = (function(window, document, $){


	//Instances
	var _key 		= Key;
	// var _content 	= new Content();



	//private vars
	var _baseUrl 		= 'http://api.yootunes.com';

	var _seek 				= {};
		_seek.drag,
		_seek.seekTime,
		_seek.seekScrub,
		_seek.seekBarWidth,
		_seek.seekBarLeft,
		_seek.seekBarRight
		_seek.seekFillLeft,
		_seek.seekFillWidth;

	var _videoSize 			= {};
		_videoSize.normal 	= false,
		_videoSize.full 	= false;

	var _userId 			= window.userId;
	var _dropdownOpen 		= false;
	var _dropdownId 		= '';

	var _currentTheme 		= '';





	//constructor method
	var ui = function(){



		//Title/tooltip handler. Write function to display pre designed modal
		//taht starts at the offset left of the hovered over item.
		//use for tooltips, feedback, validation, error messages, and upgrade acct encouragement.









		//Sign up button interaction handler=======//
		$(document).on('click', '#sign-in-btn', function(){

			this.toggle;

			var selector = '.signin';
			var id = $(this).attr('data-id');

			//returns the opposite boolean toggle value
			this.toggle = toggleUi(this.toggle, selector, id);

		});//sing-in-button click







		//Stop propagation on children of main menu====//
		$(document).on('click', 'li', function(event){
			event.stopPropagation();
		});






		//HOVER EFFECTS over li items -necessary to use JS.
		//Trouble overriding CSS :hover on theme change.


			//MOUSEOVER hover effect for LIGHT theme.
			$(document).on('mouseover', '.resultItems, .li-playlist, .library-nav ul li', function(){

				var resultId = $(this).attr('data-id');

				if(window.theme === 'light' || _currentTheme === 'light'){

					//If dropdown is open or closed set hover color accordingly
					if(!_dropdownOpen){
						$(this).css({'background': '#e7e7e7'});
					}else if(_dropdownOpen && resultId === _dropdownId){
						$(this).css({'background': '#ffffff'});
					}

				}else if(window.theme === 'dark' || _currentTheme === 'dark'){

					//If dropdown is open or closed set hover color accordingly
					if(!_dropdownOpen){
						$(this).css({'background': '#2a2d2d'});
					}else if(_dropdownOpen && resultId === _dropdownId){

						$(this).css({'background': '#ffffff'});
					}
				}
			});//MOUSEOVER





			//MOUSEOUT hover effect for LIGHT theme.
			$(document).on('mouseout', '.resultItems, .li-playlist, .library-nav ul li', function(){

				var resultId = $(this).attr('data-id');

				if(window.theme === 'light' || _currentTheme === 'light'){

					//If dropdown is open or closed set hover color accordingly
					if(!_dropdownOpen){
						$(this).css({'background': 'none'});
					}else if(_dropdownOpen && resultId === _dropdownId){
						$(this).css({'background': '#ffffff'});
					}

				}else if(window.theme === 'dark' || _currentTheme === 'dark'){

					//If dropdown is open or closed set hover color accordingly
					if(!_dropdownOpen){
						$(this).css({'background': 'none'});
					}else if(_dropdownOpen && resultId === _dropdownId){
						$(this).css({'background': '#ffffff'});
					}
				}
			});










		//Playlist menu dropdown interaction==========//
		$(document).on('click', '.playlist-menu', function(event){

			this.toggle;

			var selector = '.playlist-dropdown';
			var id = $(this).attr('data-id');

			//returns the opposite boolean toggle value
			this.toggle = toggleUi(this.toggle, selector, id);

		});





		//Main menu dropdown interaction=============//
		$(document).on('click', '.dropdown-trigger', function(event){

			//Prevent dropdown on mobile view
			if($(window).width() > '650'){

				//Ensures form is hidden at start
				$('.newPlaylistForm').hide();

				this.toggle;

				var selector 	= '.main-dropdown';
				var id 			= $(this).attr('data-id');
				_dropdownId 	= id;


				//returns the opposite boolean toggle value
				this.toggle = toggleUi(this.toggle, selector, id);

				if(this.toggle){

					_dropdownOpen = true;

					$('.resultItems').removeClass('bg-white');
					$('.resultItems').removeClass('bold');
					$('.resultItems').css({'borderBottom':'none'});

					//Set the li item that triggered dropdown to white bg
					$(this).parent().addClass('bg-white');
					$(this).parent().addClass('bold');
					$(this).parent().css({'borderBottom':'1px solid #ebebeb'});


				}else{

					_dropdownOpen = false;

					$('.resultItems').css({'background':'none'});
					$(this).parent().removeClass('bg-white');
					$(this).parent().removeClass('bold');
					$(this).parent().css({'borderBottom':'none'});
				}
			}else{

				//Trigger play here instead/ Same funcitonality as play icon click
				console.log(Player.playItem());
				// Player.playItem($(this));

			}

		});








		//Add create playlist show/hide interaction=========//
		$(document).on('click', '.createNewPlaylistLink', function(event){

			var that = this;
			that.toggle;

			var selector = '.newPlaylistForm';
			var id = null;

			//returns the opposite boolean toggle value
			that.toggle = toggleUi(that.toggle, selector);

		});








		//Prevents parent div from scrolling while reaching end of scroll in child
		$(document).on('mouseover', '.playlistSubScrollContainer', function(){
			$('.scroll-container').css({'overflow':'hidden'});
		});

		$(document).on('mouseout', '.playlistSubScrollContainer', function(){
			$('.scroll-container').css({'overflow':'scroll'});
		});











		//Player seek bar ui controller===//
		//================================//
		//mousedown to start drag operation
		$(document).on('mousedown', '#seek-dot', function(event){

			var scrubber 			= '#seek-dot';
				_seek.seekBarWidth 	= $('#seek-bar').width(),
				_seek.seekBarLeft 	= $('#seek-bar').offset().left,
				_seek.seekBarRight 	= $('#seek-bar').offset().left + _seek.seekBarWidth,
				_seek.seekFill 		= $('.seek-fill'),
				_seek.drag 			= true;

				Player.prototype.dragging(true);

			//required to prevent text selection on mouseout of seekBar
			event.preventDefault();

			//calls the seek bar controller
			moving(scrubber);
		});


		//mouseup to stop drag
		$(document).on('mouseup', function(e){

			if(_seek.drag === true){

				Player.prototype.dragging(false, _seek.seekScrub);
				_seek.drag = false;
			}


		});









		//Player Screensize Handlers======//
		//================================//
		//Minimize or show Normal video size
		$(document).on('click', '#video-min', function(){


			//Sets video to normal size
			if(!_videoSize.normal){

				showNormalSize();

				_videoSize.normal = !_videoSize.normal;
				_videoSize.full = false;

			//Sets video to minimized size
			}else{
				showMinSize();

				_videoSize.normal = !_videoSize.normal;
				_videoSize.full = false;
			}
		});





		//Fullscreen handlers
		$(document).on('click', '#video-full', function(){

			//If video is not already full
			if(!_videoSize.full){
				enterFullscreen();

				_videoSize.full = !_videoSize.full;
				_videoSize.normal = true;
			}else{

				showNormalSize();

				_videoSize.full = !_videoSize.full;
				_videoSize.normal = false;
			}
		});





		//Esc fullscreen handler
		// $(document).on('keydown', function(){
		// 	if(_key.Esc){

		// 		showNormalSize();

		// 		_videoSize.full = !_videoSize.full;
		// 		_videoSize.normal = false;
		// 	}
		// });








		//CLick handler for share link alert box
		$(document).on('click', '.linkShare', function(event){
			var link = $(this).attr('href');

			//Send link text to alert window
			copyToClipboard(link);

			event.preventDefault();
			return false;
		});









		//Modal close functionality
		$(document).on('click', '.modalCloseIcon', function(){

			//Hide modal window nodes
			$('#restoreAcctModal').fadeOut();
			$('#deleteAcctModal').fadeOut();
			$('#nameDeviceModal').fadeOut();
		});









		//Dark theme set
		$(document).on('change', '#themeDark', function(){

			_userId = window.userId;

			//Store theme choice as dark
			if($('#themeDark').is(':checked')){

				_currentTheme = "dark";

				themeDark();

				//Build API url
				var API_URL = _baseUrl + '/set-theme/' + _userId + '/' + _currentTheme;

				//Call API to add song to library
				$.ajax({
					url : API_URL,
					method : 'GET',
					dataType : 'json',
					success : function(response){

					}//success
				});//ajax



			}else{//Store theme as light


				_currentTheme = "light";

				themeLight();

				//Build API url
				var API_URL = _baseUrl + '/set-theme/' + _userId + '/' + _currentTheme;

				//Call API to add song to library
				$.ajax({
					url : API_URL,
					method : 'GET',
					dataType : 'json',
					success : function(response){

					}//success
				});//ajax

			}//else

		});








		//Event triggered by playOn socket. Applies to slave device
		$(document).on('slaveMode', function(){
			enterFullscreen();
		});


		//Event triggered by pauseOn socket. Applies to slave device
		$(document).on('showMinSize', function(){
			showMinSize();
		});















	};//constructor function
	//================================//

	//methods and properties.
	ui.prototype = {
		constructor 	: ui,
		themeDark 		: themeDark,
		themeLight 		: themeLight
	};

	//return constructor
	return ui;










//================================//
//Class methods===================//
//================================//

	//Button/menu interaction controllers====//
	//toggle Controller===========//
	function toggleUi(toggle, selector, id){

		this.toggle = toggle;

		//clears previously open li in ul, if open
		$(selector).fadeOut();

		//Check for provided id
		if(id === null || id === "" || id === undefined){

			//Fade in
			if(!this.toggle){
				$(selector).fadeIn();

				//custom event for notifying sub menu handler of new sub menu open
				$.event.trigger({
					type	: "subOpen",
					selector: selector
				});

			//Fade out
			}else{
				$(selector).fadeOut();
			}

		//runs if providing event comes w/ a specific id
		}else{

			//Fade in
			if(!this.toggle){
				$(selector + '[data-id=' + id + ']').fadeIn();

				//custom event for notifying sub menu handler of new sub menu open
				$.event.trigger({
					type	: "subOpen",
					selector: selector
				});

			//Fade out
			}else{
				$(selector + '[data-id=' + id + ']').fadeOut();
			}
		}

			return this.toggle = !this.toggle;
	}//toggleUi










	//Seek bar drag functionality====//
	function moving(scrubber){

		$(document).on('mousemove', function(e){
			// var set-time = ((e.pageX - seek.seekBarLeft) / seek.seekBarWidth) * seek.duration;

			//if dragging is true, allow scrubber to move
			if(_seek.drag){

				$(scrubber).offset({left: e.pageX});

				_seek.seekScrub = $(scrubber).offset().left;


				//creates a perimeter scrubber can't leave
				if(_seek.seekScrub < _seek.seekBarLeft){
					$(scrubber).offset({left: _seek.seekBarLeft});

				}else if(_seek.seekScrub > (_seek.seekBarRight  - $(scrubber).width())){
					$(scrubber).offset({left: (_seek.seekBarRight - $(scrubber).width())});

				}

				//Sets seek bar backfill bar width
				_seek.seekFill.width($(scrubber).offset().left - _seek.seekBarLeft);
			};
		});
	};










	//Player screensize functions=======//
	//Controls entering fullscreen iframe manipulation
	function enterFullscreen(){

		$('iframe#video').css({
			'position' : 'absolute',
			'top'      : '0',
			'bottom'   : '0',
			'left'     : '0',
			'right'    : '0',
			'height'   : '100%',
			'width'    : '100%',
			'display'  : 'block'
		});


		$('.video-size-ctrl').css({
			'top'     	 : '9px',
			'left' 		 : '9px',
			'background' : 'none',
			'textAlign'  : 'left',
			'border'     : 'none'
		});


		$('.footer').css({
			'opacity' : '.8'
		});
	}












	//Controls minimizing the video
	function showNormalSize(){

		$('iframe#video').css({
			'height'   : '227px',
			'display'  : 'block',
			'position' : 'absolute',
			'top'      : 'initial',
			'bottom'   : '72px',
			'left'     : '0',
			'right'    : 'initial',
			'width'    : '25%'
		});

		$('.video-size-ctrl').css({
			'bottom'     : '72px',
			'background' : '#0f1010',
			'textAlign'  : 'right',
			'top'     	 : 'initial',
			'left' 		 : 'initial',
		});

		$('.footer').css({
			'opacity' : '1'
		});
	}








	//Controls minimizing the video
	function showMinSize(){


		$('iframe#video').css({
			'position' : 'absolute',
			'top'      : 'initial',
			'bottom'   : '72px',
			'left'     : '0',
			'right'    : 'initial',
			'height'   : '33px',
			// 'display'  : 'none',//breaks iframe
			'width'    : '25%'
		});



		$('.video-size-ctrl').css({
			'bottom'     : '72px',
			'background' : '#0f1010',
			'textAlign'  : 'right',
			'top'     	 : 'initial',
			'left' 		 : 'initial',
		});

		$('.footer').css({
			'opacity' : '1'
		});
	}













	//Notify user of link to be copied
	function copyToClipboard(link){

	  window.prompt("Copy to clipboard: Ctrl+C, Enter", link);
	}













	function themeDark(){

		//Set global and cookie to dark
		window.theme = 'dark';
		document.cookie = 'theme=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
		document.cookie = "theme=dark";


		$('#app').css({
			'background': '#272a2a'}
		);

		$('#app, #app a, .li-col2, .li-col3, .li-col4, .li-col5, #searchInput, .playlist-nav a.playlistTitle').addClass('dark-fonts');


		$('.li-header').addClass('dark-border-bottom');
		$('.section-header').addClass('dark-border-bottom');
		$('#searchSubmit').addClass('dark-border-left');

		$('aside.app').addClass('dark-border-right');
		$('input[type=text]').addClass('dark-placeholder');

		$('li.resultItems').find('.addToLibrary').find('.add-icon').attr('src', 'images/icons/trash-icon-light.svg');

		$('.info-wrapper input[type=text], .info-wrapper input[type=password], .info-wrapper input[type=email], #infoTitleGender').addClass('dark-input-bg');
	}







	function themeLight(){

		//set global & cookie to light
		window.theme = 'light';
		document.cookie = 'theme=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
		document.cookie = "theme=light";


		$('#app').css({
			'background': '#ebebeb'}
		);

		$('#app, #app a, .li-col2, .li-col3, .li-col4, .li-col5, #searchInput, .playlist-nav a.playlistTitle').removeClass('dark-fonts');


		$('.li-header').removeClass('dark-border-bottom');
		$('.section-header').removeClass('dark-border-bottom');
		$('#searchSubmit').removeClass('dark-border-left');

		$('aside.app').removeClass('dark-border-right');
		$('input[type=text]').removeClass('dark-placeholder');

		$('li.resultItems').find('.addToLibrary').find('.add-icon').attr('src', 'images/icons/trash-icon.svg');

		$('.info-wrapper input[type=text], .info-wrapper input[type=password], .info-wrapper input[type=email], #infoTitleGender').removeClass('dark-input-bg');
	}







});//define()
})();//function