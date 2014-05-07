(function(){
define(['jquery', 'js/libs/keyHash.js', 'Player', 'getCookies', 'lightbox'], function($, Key, Player, getCookies, lightbox){


	//private vars
	var _baseUrl 			= 'http://api.yootunes.com';

	var DOM 				= {};
	var _key 				= Key;

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
	var _popupToggle 		= true;
	var _previousId 		= '';

	var _currentTheme 		= '';

	var app_break_smmd 		= '800';










		//Title/tooltip handler. Write function to display pre designed modal
		//taht starts at the offset left of the hovered over item.
		//use for tooltips, feedback, validation, error messages, and upgrade acct encouragement.

		//Listen for rendered to register DOM elements
		$(document).on('rendered', function(event){
			registerDOM(event.template);
		});




		//on window resize, recalculate windowWidth for queries
		window.windowWidth = $(window).width();

		$(window).resize(function() {
			window.windowWidth = $(window).width();

			//On resize show sidebar
			if(window.windowWidth > app_break_smmd){
				DOM.sectionApp.removeClass('mainSlideLeft');
				DOM.asideApp.removeClass('sidebarSlideLeft');

				DOM.video.show();
				DOM.videoSizeCtrl.show();
				DOM.footer.show();
			}else{
				DOM.video.hide();
				DOM.videoSizeCtrl.hide();
				DOM.footer.hide();
			}


		});




		//Sign up button interaction handler=======//
		$(document).on('click', '#sign-in-btn', function(){

			this.toggle;

			var selector	= '.signin';
			var id 			= $(this).attr('data-id');

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

			var selector 	= '.playlist-dropdown';
			var id 			= $(this).attr('data-id');

			//returns the opposite boolean toggle value
			this.toggle = toggleUi(this.toggle, selector, id);

		});





		//Main menu dropdown interaction=============//
		$(document).on('click', '.dropdown-trigger', function(event){

			//Prevent dropdown on mobile view
			if(window.windowWidth > app_break_smmd){

				//Ensures form is hidden at start
				DOM.newPlaylistForm.hide();

				this.toggle;

				var selector 	= '.main-dropdown';
				var id 			= $(this).attr('data-id');
				_dropdownId 	= id;


				//returns the opposite boolean toggle value
				this.toggle = toggleUi(this.toggle, selector, id);

				if(this.toggle){

					//Loads video thumbnail when dropdown is revealed
					loadThumb(id);
					console.log(id, "dropdown id");


					_dropdownOpen = true;

					DOM.resultItems.removeClass('bg-white');
					DOM.resultItems.removeClass('bold');
					DOM.resultItems.css({'borderBottom':'none'});

					//Set the li item that triggered dropdown to white bg
					$(this).parent().addClass('bg-white');
					$(this).parent().addClass('bold');
					$(this).parent().css({'borderBottom':'1px solid #ebebeb'});


				}else{

					_dropdownOpen = false;

					DOM.resultItems.css({'background':'none'});
					$(this).parent().removeClass('bg-white');
					$(this).parent().removeClass('bold');
					$(this).parent().css({'borderBottom':'none'});
				}



			//======================================//
			}else{//Handles mobile view popup toggling
			//======================================//
				var playOnDevice =  DOM.mobilePlayOnSelected.attr('data-id');

				var thisId = $(this).parent().find('.playIconImg').attr('data-videoId');


				//Highlight selected mobile video
				DOM.resultItems.removeClass('highlight');
				$(this).parent().addClass('highlight');

				//Set play icon to pause if video is selected
				DOM.resultItems.find('.playIconImg').attr('src', 'images/icons/play-drk.png');
				$(this).parent().find('.playIconImg').attr('src', 'images/icons/pause-drk.png');


				//Toggle mobile video if in normal mode not master mode
				if(playOnDevice === window.thisDevice){

					if(_previousId !== thisId){

						//Handle mobile video popup
						if(_popupToggle === true){

							showNormalSize();

						}else{
							showMinSize();

						}

						//Set previousId for toggle flow
						_previousId = thisId;

					}else{

						//Handle mobile video popup
						if(_popupToggle === false){


							showNormalSize();
							_popupToggle = !_popupToggle;
						}else{
							showMinSize();

							_popupToggle = !_popupToggle;
						}//else
					}//else
				}else{

					//Reset popup video
					showMinSize();
					_popupToggle = false;
				}//else playOnDevice
			}//else breakpoint
		});







		//Add create playlist show/hide interaction=========//
		$(document).on('click', '.createNewPlaylistLink', function(event){

			var that 		= this;
			var selector 	= '.newPlaylistForm';
			var id 			= null;
			that.toggle;

			//returns the opposite boolean toggle value
			that.toggle = toggleUi(that.toggle, selector);

		});







		//Prevents parent div from scrolling while reaching end of scroll in child
		$(document).on('mouseover', '.playlistSubScrollContainer', function(){
			DOM.scrollContainer.css({'overflow':'hidden'});
		});

		$(document).on('mouseout', '.playlistSubScrollContainer', function(){
			DOM.scrollContainer.css({'overflow':'scroll'});
		});











		//Player seek bar ui controller===//
		//================================//
		//mousedown to start drag operation
		$(document).on('mousedown', '#seek-dot', function(event){

			var scrubber 			= '#seek-dot';
				_seek.seekBarWidth 	= DOM.seekBar.width(),
				_seek.seekBarLeft 	= DOM.seekBar.offset().left,
				_seek.seekBarRight 	= DOM.seekBar.offset().left + _seek.seekBarWidth,
				_seek.seekFill 		= DOM.seekFill,
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
			DOM.restoreAcctModal.fadeOut();
			DOM.deleteAcctModal.fadeOut();
			DOM.nameDeviceModal.fadeOut();
		});









		//Dark theme set
		$(document).on('change', '#themeDark', function(){

			_userId = window.userId;

			//Store theme choice as dark
			if(DOM.themeDark.is(':checked')){

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







		//Mobile menu handler
		$(document).on('click', '#menu-btn', function(){

			this.toggle;

			if(!this.toggle){
				// DOM.adsense.fadeOut();

				DOM.sectionApp.addClass('mainSlideRight');
				DOM.asideApp.addClass('sidebarSlideRight');

				//reset slide left
				DOM.sectionApp.removeClass('mainSlideLeft');
				DOM.asideApp.removeClass('sidebarSlideLeft');

				this.toggle = !this.toggle;

			}else{
				// DOM.adsense.fadeIn();

				DOM.sectionApp.addClass('mainSlideLeft');
				DOM.asideApp.addClass('sidebarSlideLeft');

				//reset slide right
				DOM.sectionApp.removeClass('mainSlideRight');
				DOM.asideApp.removeClass('sidebarSlideRight');

				this.toggle = !this.toggle;
			}
		});








		//Hide adsense ads for a time
		$(document).on('click', '#closeAds', function(event){
			hideAdsense();
		});






//================================//
//End event logic=================//
//================================//



















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

		//hide ads
		DOM.adsense.hide();

		if(window.windowWidth < app_break_smmd){

		}else{
//was $(iframe#video)
			DOM.video.css({
				'position' : 'absolute',
				'top'      : '0',
				'bottom'   : '0',
				'left'     : '0',
				'right'    : '0',
				'height'   : '100%',
				'width'    : '100%',
				'display'  : 'block'
			});


			DOM.videoSizeCtrl.css({
				'top'     	 : '9px',
				'left' 		 : '9px',
				'background' : 'none',
				'textAlign'  : 'left',
				'border'     : 'none'
			});
		}//else


		DOM.footer.css({
			'opacity' : '.8'
		});
	}












	//Controls minimizing the video
	function showNormalSize(){


		if(window.windowWidth < app_break_smmd){

			//hide ads
			// DOM.adsense.hide();

			DOM.videoOverlay.css({
				'height'   : '227px',
				'display'  : 'block',
				'position' : 'fixed',
				'top'      : 'initial',
				'bottom'   : '72px',
				'left'     : '0',
				'right'    : 'initial',
				'width'    : '100%',
				'transition-duration' : '1s',
				'-webkit-transition-duration' : '1s'
			});

			DOM.videoSizeCtrl.hide();

			DOM.video.hide();

		}else{

			DOM.video.css({
				'height'   : '227px',
				'display'  : 'block',
				'position' : 'absolute',
				'top'      : 'initial',
				'bottom'   : '72px',
				'left'     : '0',
				'right'    : 'initial',
				'width'    : '25%'
			});

			DOM.videoSizeCtrl.css({
				'bottom'     : '72px',
				'background' : '#0f1010',
				'textAlign'  : 'right',
				'top'     	 : 'initial',
				'left' 		 : 'initial',
			});
		}
			DOM.footer.css({
				'opacity' : '1'
			});
	}








	//Controls minimizing the video
	function showMinSize(){

		if(window.windowWidth < app_break_smmd){

			//Show ads
			// DOM.adsense.show();

			DOM.videoOverlay.css({
				'position' : 'fixed',
				'top'      : 'initial',
				'bottom'   : '0px',
				'left'     : '0',
				'right'    : 'initial',
				'height'   : '30px',
				'width'    : '100%',
				'transition-duration' : '1s',
				'-webkit-transition-duration' : '1s'
			});

			DOM.videoSizeCtrl.hide();

			DOM.video.hide();

		}else{

			DOM.video.css({
				'position' : 'absolute',
				'top'      : 'initial',
				'bottom'   : '72px',
				'left'     : '0',
				'right'    : 'initial',
				'height'   : '33px',
				'width'    : '25%'
			});

			DOM.videoSizeCtrl.css({
				'bottom'     : '72px',
				'background' : '#0f1010',
				'textAlign'  : 'right',
				'top'     	 : 'initial',
				'left' 		 : 'initial'
			});
		}

			DOM.footer.css({
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


		DOM.app.css({
			'background': '#272a2a'}
		);

		$('#app, #app a, .li-col2, .li-col3, .li-col4, .li-col5, #searchInput, .playlist-nav a.playlistTitle').addClass('dark-fonts');


		DOM.liHeader.addClass('dark-border-bottom');
		DOM.sectionHeader.addClass('dark-border-bottom');
		DOM.searchSubmit.addClass('dark-border-left');

		DOM.asideApp.addClass('dark-border-right');
		DOM.inputText.addClass('dark-placeholder');

		DOM.resultItems.find('.addToLibrary').find('.add-icon').attr('src', 'images/icons/trash-icon-light.svg');

		$('.info-wrapper input[type=text], .info-wrapper input[type=password], .info-wrapper input[type=email], #infoTitleGender').addClass('dark-input-bg');
	}










	function themeLight(){

		//set global & cookie to light
		window.theme = 'light';
		document.cookie = 'theme=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
		document.cookie = "theme=light";


		DOM.app.css({
			'background': '#ebebeb'}
		);

		$('#app, #app a, .li-col2, .li-col3, .li-col4, .li-col5, #searchInput, .playlist-nav a.playlistTitle').removeClass('dark-fonts');


		DOM.liHeader.removeClass('dark-border-bottom');
		DOM.sectionHeader.removeClass('dark-border-bottom');
		DOM.searchSubmit.removeClass('dark-border-left');

		DOM.asideApp.removeClass('dark-border-right');
		DOM.inputText.removeClass('dark-placeholder');

		DOM.resultItems.find('.addToLibrary').find('.add-icon').attr('src', 'images/icons/trash-icon.svg');

		$('.info-wrapper input[type=text], .info-wrapper input[type=password], .info-wrapper input[type=email], #infoTitleGender').removeClass('dark-input-bg');
	}










	function hideAdsense(){
		DOM.adsense.fadeOut();
		setTimeout(showAdsense, 25000);
	}

	function showAdsense(){
		DOM.adsense.fadeIn();
	}








	//Reduces library thumb get requests to an on as needed basis
	function loadThumb(id){
		var videoId = $('.youtube-img[data-id=' + id + ']').attr('data-videoId');
		var thumbSrc = 'https://i.ytimg.com/vi/' + videoId + '/default.jpg';
		var hiresSrc = 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg';
		console.log(videoId, thumbSrc, hiresSrc);

		//Set thumbnail src
		$('.youtube-img[data-id=' + id + ']').attr('src', thumbSrc);


		//Set lightbox higher res src
		$('.youtube-img-a[data-id=' + id + ']').attr('href', hiresSrc);
	}









	function registerDOM(template){

		if(template === '#app'){
			DOM.sectionApp 				= $('section.app');
			DOM.asideApp 				= $('aside.app');
			DOM.video 					= $('#video');
			DOM.videoSizeCtrl 			= $('div.video-size-ctrl');
			DOM.footer 					= $('div.footer');
			DOM.resultItems 			= $('li.resultItems');
			DOM.mobilePlayOnSelected 	= $('#mobile-play-on option:selected');
			DOM.scrollContainer 		= $('.scroll-container');
			DOM.seekBar 				= $('#seek-bar');
			DOM.seekFill 				= $('.seek-fill');
			DOM.nameDeviceModal 		= $('#nameDeviceModal');
			DOM.adsense 				= $('#adsense');
			DOM.videoOverlay 			= $('#video-overlay');
			DOM.app 					= $('#app');
			DOM.liHeader 				= $('.li-header');
			DOM.sectionHeader 			= $('.section-header');
			DOM.searchSubmit 			= $('#searchSubmit');
			DOM.inputText 				= $('input[type=text]');
			DOM.newPlaylistForm 		= $('.newPlaylistForm');

		}//#app

		if(template === '#landing'){
			DOM.restoreAcctModal = $('#restoreAcctModal');

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
			DOM.deleteAcctModal = $('#deleteAcctModal');
			DOM.themeDark 		= $('#themeDark');

		}//#acctSettings
	}




















	//methods and properties.
	var exports = {
		themeDark 		: themeDark,
		themeLight 		: themeLight,
		showNormalSize 	: showNormalSize,
		showMinSize 	: showMinSize
	};

	//return constructor
	return exports;







});//define()
})();//function