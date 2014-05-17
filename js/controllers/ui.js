(function(){
define(['jquery', 'qtip', 'toggleUi', 'videoSizer', 'Player', 'Library','getCookies', 'lightbox'], function($, qtip, toggleUi, videoSizer, Player, Library, getCookies, lightbox){


	//private vars
	var _baseUrl 			= 'http://api.atomplayer.com';

	var itemHolding 		= 0;
	var _dragResult 		= {};
		_dragResult.dragging= false;
		_dragResult.origX;
		_dragResult.origY;
	var _clone 				= '';
	var _setClone 			= false;

	var _overPlaylist;

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

	var _userId;
	var _dropdownOpen 		= false;
	var _dropdownId 		= '';
	var _popupToggle 		= true;
	var _previousId 		= '';
	var _currentTheme 		= '';

	//CSS breakpoints
	var app_break_smmd 		= '800';















			//getStarted button interaction handler=======//
			$(document).on('click', '#getStarted', function(){

				this.toggle;

				var selector	= '#signupContainer';
				var id 			= null;

				//returns the opposite boolean toggle value
				this.toggle = toggleUi(this.toggle, selector, id);
			});



			//Title/tooltip handler. Write function to display pre designed modal
			//taht starts at the offset left of the hovered over item.
			//use for tooltips, feedback, validation, error messages, and upgrade acct encouragement.

			//========================================//
			//Listen for RENDERED
			//========================================//
			$(document).on('rendered', function(event){

//NOTE**** Qtip slows app down by a few seconds
				// if(event.template === '#libraryItem' || event.template === '#playlist'){

				// 	//============================//
				// 	//Enable QTIP on all tooltips
				// 	//============================//
				// 	$(document).find('[title]').qtip({
				// 		style: {
				// 			classes: 'qtip-tipsy'
				// 		},
				// 		position: {
				// 			target: [9, 9]
				// 	    },
				// 	    show: {
				// 	        delay: 1000
				// 	    },
				// 	    hide: {
				// 	    	event: 'click mouseleave',
				// 	        delay: 500
				// 	    }
				// 	});
				// }
				if(event.template === '#app'){



				};




				if(event.template === '#libraryItem'){

					//Failsafe retrieval of theme
					if(window.userId === undefined){
						window.theme = getCookies.theme;
					}

					//MAIN SET POINT for _userId for this UI module
					_userId = window.userId;


					//Media Query
					if(window.windowWidth < app_break_smmd){
						$('span.li-col1').hide();
					}else{
						$('span.li-col1').show();
					}


				}
			});




			//on window resize, recalculate windowWidth for queries
			window.windowWidth = $(window).width();

			$(window).resize(function() {
				window.windowWidth 	= $(window).width();
				var videoSizeCtrl 	= $('div.video-size-ctrl');
				var video 			= $('#video');
				var footer 			= $('div.footer');

				//On resize show sidebar
				if(window.windowWidth > app_break_smmd){
					$('section.app').removeClass('mainSlideLeft');
					$('aside.app').removeClass('sidebarSlideLeft');

					video.show();
					videoSizeCtrl.show();
					footer.show();
					$('span.li-col1').show();
				}else{
					video.hide();
					videoSizeCtrl.hide();
					footer.hide();
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








			//Show/Hide create NEW PLAYLIST form on hover over playlist title
			$(document).on('mouseover', 'span#revealForm', function(event){

				//Only allow form to show if we're dragging result
				if(_dragResult.dragging === true){
					$('#hiddenCreatePlaylistForm').show();
				}


			});

			// $(document).on('mouseout', 'span#revealForm', function(event){

			// 		//Empty form input then hide it
			// 		// $('.newPlaylistInput').val('');
			// 		$('#hiddenCreatePlaylistForm').hide();


			// });

			//NEW PLAYLIST BUTTON interaction handler=======//
			$(document).on('click', '.add-playlist-icon', function(){

				this.toggle;

				var selector	= '#hiddenCreatePlaylistForm';
				var id 			= null;

				//returns the opposite boolean toggle value
				this.toggle = toggleUi(this.toggle, selector, id);

			});//new playlist button click










			//Add to playlist DRAG & DROP interaction handler=======//
			$(document).on('mousedown', '.resultItems', function(event){

				var that 	= $(this);
				var evt 	= event;

				//Wait for prolonged hold before enabling itemDragging
				itemHolding = setTimeout(function(){
					itemDragging(that, evt);
				}, 1000);

			//bind events that can cancel timeout before it runs. Prevents multiple clones
			}).bind('click mouseup mouseleave', '.resultItems', function(){
			    clearTimeout(itemHolding);
			});











			//MOUSEOVER triangle icon hover effect.
			$(document).on('mouseover', '.li-playlist', function(event){
				$('li.li-playlist').find('span.playlist-menu').css({'display' : 'none'});

				$(this).find('span.playlist-menu').css({'display' : 'inline'});

				_overPlaylist = $(this);
			});

			//MOUSEOVER triangle icon hover effect.
			$(document).on('mouseout', '.li-playlist', function(event){
				$('li.li-playlist').find('span.playlist-menu').css({'display' : 'none'});
			});






			//MOUSEOVER hover effect.
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
						$(this).css({'background': '#202222'});
					}else if(_dropdownOpen && resultId === _dropdownId){

						$(this).css({'background': '#ffffff'});
					}
				}

				//Show draggable icon on non-mobile devices
				if(window.windowWidth > app_break_smmd){
					//Show only this draggable icon on hover
					$('img.draggableIcon').css({'display' : 'none'})
					$(this).find('img.draggableIcon').css({'display' : 'block'});
				}



			});//MOUSEOVER





			//MOUSEOUT hover effect.
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

				this.toggle;

				var selector 		= '.main-dropdown';
				var id 				= $(this).attr('data-id');
				var libraryWrapper 	= $('#libraryWrapper');
				var resultItems 	= libraryWrapper.find('li.resultItems');
				var thisId 			= $(this).parent().find('img.playIconImg').attr('data-videoId');
				_dropdownId 		= id;
				$('#minimizeOverlay').fadeIn();


			//Prevent dropdown on mobile view
			if(window.windowWidth > app_break_smmd){

				//Ensures form is hidden at start
				// $('.newPlaylistForm').hide();


				//returns the opposite boolean toggle value
				this.toggle = toggleUi(this.toggle, selector, id);

				//==============================//
				if(this.toggle){//DROPDOWN OPEN

					//Remove white bg from all other li items
					resultItems.css({'background' : 'none'});
					$(this).parent().css({'background' : '#ffffff'});

					//Loads video thumbnail when dropdown is revealed
					loadThumb(id);

					_dropdownOpen = true;

					//Show/hide last col if not a query
					if(window.state !== "query"){
						//Show last column
						$('span.li-col7').hide();//<----causing add icon to disappear
						$('span.li-col4').css({'width':'16.6666667%'});//2 col Album column

						$(this).find('span.li-col7').show();
						$('span.li-col4').css({'width':'8.33333333%'});//1 col Album col
					}



					resultItems.removeClass('dropdown-bold');
					resultItems.css({'borderBottom':'none'});

					//Set the li item that triggered dropdown to white bg
					$(this).parent().addClass('bg-white');
					$(this).parent().addClass('dropdown-bold');
					$(this).parent().css({'borderBottom':'1px solid #343838'});

					//Darken play icon

					// resultItems.find('img.playIconImg').attr('src', 'images/icons/play-drk.png');
					// $(this).parent().find('img.playIconImg').attr('src', 'images/icons/play-blck.png');


				}else{//DROPDOWN CLOSE

					//Show/hide last col if not a query
					if(window.state !== "query"){
						//Hide last column
						$('span.li-col7').hide();//<----causing add icon to disappear
						$('span.li-col4').css({'width':'16.6666667%'});//2 col Album column
					}

					$(this).parent().css({'background' : 'none'});

					_dropdownOpen = false;

					resultItems.css({'background':'none'});
					$(this).parent().removeClass('bg-white');
					$(this).parent().removeClass('dropdown-bold');
					$(this).parent().css({'borderBottom':'none'});

					//Lighten play icon
					// $(this).parent().find('img.playIconImg').attr('src', 'images/icons/play-drk.png');
				}



			//======================================//
			}else{//Handles mobile view popup toggling
			//======================================//
				var playOnDevice 	=  $('#mobile-play-on option:selected').attr('data-id');
				var minimizeIcon 	= $('#minimizeOverlay');

				//Change li text color of the playing item
				resultItems.find('span.li-col2, span.li-col3, span.li-col4, span.li-col5, span.li-col6').removeClass('red');//red
				libraryWrapper.find('li.resultItems[data-videoId=' + thisId + ']').find('span.li-col2, span.li-col3, span.li-col4, span.li-col5, span.li-col6').addClass('red');//red

				//Highlight selected mobile video
				resultItems.removeClass('highlight');
				$(this).parent().addClass('highlight');

				//Set play icon to pause if video is selected
				resultItems.find('img.playIconImg').attr('src', 'images/icons/play-drk.png');
				$(this).parent().find('img.playIconImg').attr('src', 'images/icons/pause-drk.png');


				//Toggle mobile video if in normal mode not master mode
				if(playOnDevice === window.thisDevice){

					//listen for user to tap video to attempt to minimize it
					$(document).on('click', '#minimizeOverlay', function(){

						toggleMobileVideoSizes(thisId);
						$(this).find('#video-min').toggleClass('animated pulse');
					});

						toggleMobileVideoSizes(thisId);


				}else{

					//Reset popup video
					videoSizer.minView();
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
			$('#scroll-container').css({'overflow':'hidden'});
		}).bind('mouseout', function(){
			$('#scroll-container').css({'overflow':'scroll'});
		});

		// $(document).on('mouseout', '.playlistSubScrollContainer', function(){
		// 	$('#scroll-container').css({'overflow':'scroll'});
		// });











		//Player seek bar ui controller===//
		//================================//
		//mousedown to start drag operation
		$(document).on('mousedown', '#seek-dot', function(event){

			var scrubber 			= '#seek-dot';
				_seek.seekBar 		= $('#seek-bar');
				_seek.seekBarWidth 	= _seek.seekBar .width(),
				_seek.seekBarLeft 	= _seek.seekBar .offset().left,
				_seek.seekBarRight 	= _seek.seekBar .offset().left + _seek.seekBarWidth,
				_seek.seekFill 		= $('div.seek-fill'),
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

				videoSizer.normView();

				_videoSize.normal = !_videoSize.normal;
				_videoSize.full = false;

			//Sets video to minimized size
			}else{
				videoSizer.minView();

				_videoSize.normal = !_videoSize.normal;
				_videoSize.full = false;
			}
		});





		//Fullscreen handlers
		$(document).on('click', '#video-full', function(){

			//If video is not already full
			if(!_videoSize.full){
				videoSizer.fullView();

				_videoSize.full = !_videoSize.full;
				_videoSize.normal = true;
			}else{

				videoSizer.normView();

				_videoSize.full = !_videoSize.full;
				_videoSize.normal = false;
			}
		});










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









		// //Dark theme set
		// $(document).on('change', '#themeDark', function(){

		// 	_userId = window.userId;

		// 	//Store theme choice as dark
		// 	if($('#themeDark').is(':checked')){

		// 		_currentTheme = "dark";

		// 		themeDark();

		// 		//Build API url
		// 		var API_URL = _baseUrl + '/set-theme/' + _userId + '/' + _currentTheme;

		// 		//Call API to add song to library
		// 		$.ajax({
		// 			url : API_URL,
		// 			method : 'GET',
		// 			dataType : 'json',
		// 			success : function(response){

		// 			}//success
		// 		});//ajax



		// 	}else{//Store theme as light


		// 		_currentTheme = "light";

		// 		themeLight();

		// 		//Build API url
		// 		var API_URL = _baseUrl + '/set-theme/' + _userId + '/' + _currentTheme;

		// 		//Call API to add song to library
		// 		$.ajax({
		// 			url : API_URL,
		// 			method : 'GET',
		// 			dataType : 'json',
		// 			success : function(response){

		// 			}//success
		// 		});//ajax

		// 	}//else

		// });











		//Mobile menu handler
		$(document).on('click', '#menu-btn', function(){
			var app 	= $('aside.app');
			var aside 	= $('section.app');
			var that 	= $(this);

			$(this).toggleClass('animated pulse');


			this.toggle;

			if(!this.toggle){//opening

				app.addClass('mainSlideRight');
				aside.addClass('sidebarSlideRight');

				//reset slide left
				app.removeClass('mainSlideLeft');
				aside.removeClass('sidebarSlideLeft');

				this.toggle = !this.toggle;

			}else{//closing

				app.addClass('mainSlideLeft');
				aside.addClass('sidebarSlideLeft');

				//reset slide right
				app.removeClass('mainSlideRight');
				aside.removeClass('sidebarSlideRight');

				this.toggle = !this.toggle;
			}
		});








		//Hide adsense ads for a time
		$(document).on('click', '#closeAds', function(event){
			hideAdsense();
		});









		//Log shared song
		$(document).on('click', '#footerShare', function(event){

			var songId = $(this).children().eq(0).attr('data-id');
			var API_URL = _baseUrl + '/log-shared-song/' + _userId + '/' + songId;

			$.ajax({
				url 		: API_URL,
				method 		: 'GET',
				dataType	: 'json',
				success 	: function(response){
					console.log(response);
				}//success
			});//ajax
		});









		//Log shared playlist
		$(document).on('click', '.playlistShare, .linkShare', function(event){

			var playlistId = $(this).attr('data-id');
			var API_URL = _baseUrl + '/log-shared-playlist/' + _userId + '/' + playlistId;

			$.ajax({
				url 		: API_URL,
				method 		: 'GET',
				dataType	: 'json',
				success 	: function(response){
					console.log(response);
				}//success
			});//ajax
		});
























//================================//
//End event logic=================//
//================================//



















//================================//
//Class methods===================//
//================================//










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










	// //Player screensize functions=======//
	// //Controls entering fullscreen iframe manipulation
	// function videoSizer.fullView(){

	// 	//hide ads
	// 	$('#adsense').hide();

	// 	if(window.windowWidth < app_break_smmd){

	// 	}else{

	// 		$('#video').css({
	// 			'position' : 'absolute',
	// 			'top'      : '0',
	// 			'bottom'   : '0',
	// 			'left'     : '0',
	// 			'right'    : '0',
	// 			'height'   : '100%',
	// 			'width'    : '100%',
	// 			'display'  : 'block'
	// 		});


	// 		$('div.video-size-ctrl').css({
	// 			'top'     	 : '9px',
	// 			'left' 		 : '9px',
	// 			'background' : 'none',
	// 			'textAlign'  : 'left',
	// 			'border'     : 'none'
	// 		});
	// 	}//else

	// 	//Was set to transparent until FF YT controls started showing
	// 	//FIX THIS LATER
	// 	$('div.footer').css({
	// 		'opacity' : '1'
	// 	});
	// }












	// //Controls minimizing the video
	// function videoSizer.normView(){
	// 	var videoSizeCtrl = $('div.video-size-ctrl');

	// 	if(window.windowWidth < app_break_smmd){

	// 		//hide ads
	// 		// $('#adsense').hide();

	// 		$('#video-overlay').css({
	// 			'height'   : '227px',
	// 			'display'  : 'block',
	// 			'position' : 'fixed',
	// 			'top'      : 'initial',
	// 			'bottom'   : '72px',
	// 			'left'     : '0',
	// 			'right'    : 'initial',
	// 			'width'    : '100%',
	// 			'transition-duration' : '1s',
	// 			'-webkit-transition-duration' : '1s'
	// 		});

	// 		videoSizeCtrl.hide();

	// 		$('#video').hide();

	// 	}else{


	// 		$('#video').css({
	// 			'height'   : '227px',
	// 			'display'  : 'block',
	// 			'position' : 'absolute',
	// 			'top'      : 'initial',
	// 			'bottom'   : '72px',
	// 			'left'     : '0',
	// 			'right'    : 'initial',
	// 			'width'    : '25%',
	// 			'transition-duration' : '1s',
	// 			'-webkit-transition-duration' : '1s'
	// 		});

	// 		videoSizeCtrl.css({
	// 			'bottom'     : '72px',
	// 			'background' : '#0f1010',
	// 			'textAlign'  : 'right',
	// 			'top'     	 : 'initial',
	// 			'left' 		 : 'initial',
	// 		});
	// 	}
	// 		$('div.footer').css({
	// 			'opacity' : '1'
	// 		});
	// }








	// //Controls minimizing the video
	// function videoSizer.minView(){

	// 	var videoSizeCtrl = $('div.video-size-ctrl');

	// 	if(window.windowWidth < app_break_smmd){

	// 		//Show ads
	// 		// $('#adsense').show();

	// 		$('#video-overlay').css({
	// 			'position' : 'fixed',
	// 			'top'      : 'initial',
	// 			'bottom'   : '0px',
	// 			'left'     : '0',
	// 			'right'    : 'initial',
	// 			'height'   : '30px',
	// 			'width'    : '100%',
	// 			'transition-duration' : '1s',
	// 			'-webkit-transition-duration' : '1s'
	// 		});

	// 		videoSizeCtrl.hide();

	// 		$('#video').hide();

	// 	}else{

	// 		$('#video').css({
	// 			'position' : 'absolute',
	// 			'top'      : 'initial',
	// 			'bottom'   : '72px',
	// 			'left'     : '0',
	// 			'right'    : 'initial',
	// 			'height'   : '33px',
	// 			'width'    : '25%',
	// 			'transition-duration' : '1s',
	// 			'-webkit-transition-duration' : '1s'
	// 		});

	// 		videoSizeCtrl.css({
	// 			'bottom'     : '72px',
	// 			'background' : '#0f1010',
	// 			'textAlign'  : 'right',
	// 			'top'     	 : 'initial',
	// 			'left' 		 : 'initial'
	// 		});
	// 	}

	// 		$('div.footer').css({
	// 			'opacity' : '1'
	// 		});
	// }













	//Notify user of link to be copied
	function copyToClipboard(link){

	  window.prompt("Copy to clipboard: Ctrl+C, Enter", link);
	}













	// function themeLight(){

	// 	//Set global and cookie to dark
	// 	window.theme = 'light';
	// 	document.cookie = 'theme=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
	// 	document.cookie = "theme=light";


	// 	$('#app, html, body').css({
	// 		'background': '#ebebeb'}
	// 	);

	// 	$('#app, #app a, .li-col2, .li-col3, .li-col4, .li-col5, #searchInput, .playlist-nav a.playlistTitle').addClass('light-fonts');


	// 	$('.li-header').addClass('light-border-bottom');
	// 	$('.section-header').addClass('light-border-bottom');
	// 	$('#searchSubmit').addClass('light-border-left');

	// 	$('aside.app').addClass('light-border-right');
	// 	$('input[type=text]').addClass('light-placeholder');

	// 	// $('li.resultItems').find('.addToLibrary').find('.add-icon').attr('src', 'images/icons/trash-icon-light.svg');

	// 	$('.info-wrapper input[type=text], .info-wrapper input[type=password], .info-wrapper input[type=email], #infoTitleGender').addClass('light-input-bg');
	// }










	// function themeDark(){

	// 	//set global & cookie to light
	// 	window.theme = 'dark';
	// 	document.cookie = 'theme=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
	// 	document.cookie = "theme=dark";


	// 	$('#app, html, body').css({
	// 		'background': '#1b1d1d'}
	// 	);

	// 	$('#app, #app a, .li-col2, .li-col3, .li-col4, .li-col5, #searchInput, .playlist-nav a.playlistTitle').removeClass('light-fonts');


	// 	$('.li-header').removeClass('light-border-bottom');
	// 	$('.section-header').removeClass('light-border-bottom');
	// 	$('#searchSubmit').removeClass('light-border-left');

	// 	$('aside.app').removeClass('light-border-right');
	// 	$('input[type=text]').removeClass('light-placeholder');

	// 	// $('li.resultItems').find('.addToLibrary').find('.add-icon').attr('src', 'images/icons/trash-icon.svg');

	// 	$('.info-wrapper input[type=text], .info-wrapper input[type=password], .info-wrapper input[type=email], #infoTitleGender').removeClass('light-input-bg');
	// }










	function hideAdsense(){
		$('#adsense').fadeOut();
		setTimeout(showAdsense, 25000);
	}

	function showAdsense(){
		$('#adsense').fadeIn();
	}








	//Reduces library thumb get requests to an on as needed basis
	function loadThumb(id){
		var videoId = $('.youtube-img[data-id=' + id + ']').attr('data-videoId');
		var thumbSrc = 'https://i.ytimg.com/vi/' + videoId + '/default.jpg';
		var hiresSrc = 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg';

		//Set thumbnail src
		$('img.youtube-img[data-id=' + id + ']').attr('src', thumbSrc);


		//Set lightbox higher res src
		$('a.youtube-img-a[data-id=' + id + ']').attr('href', hiresSrc);
	}


















	//Handles resultItems drag to playist coordinates
	function itemDragging(elem, event){


		if(_dragResult.dragging === false){
			console.log();
			//Set item to dragging
			_dragResult.dragging = true;

			var moving 			= false;
			var mouseIcon 		= $('img#mouseAddIcon');
			_dragResult.origX 	= elem.find('span.li-col2').offset().left;
			_dragResult.origY 	= elem.find('span.li-col2').offset().top;



				//If in dragging mode and we're moving the mouse then redraw resultItem
				$(document).on('mousemove.dragging', function(event){

					moving = true;

					if(_setClone === false){
						//Only set these values once
						_clone 		= elem.clone().find('span.li-col2').appendTo('#scroll-container');
						_setClone 	= true;


						_clone.css({
							'color' 		: '#cf2425',//red
 							'position' 		: 'absolute',
							'zIndex' 		: '999',
							'cursor'    	: 'move',
							'pointerEvents': 'none'
						});
					}//setClone

						var dragX 			= event.pageX + 15;
						var dragY 			= event.pageY - 5;
						var overPlaylist 	= getCoordinates(_overPlaylist);

						_dragResult.X 		= event.pageX;
						_dragResult.Y 		= event.pageY;

						//Only set position when dragging
						if(_dragResult.dragging){
							_clone.offset({top:dragY, left:dragX});
						}//dragging;


						//Change cursor to add icon
						if(typeof overPlaylist != 'undefined' && _dragResult.X   >= overPlaylist.left &&  _dragResult.X   <= overPlaylist.right &&
						   		 _dragResult.Y   >= overPlaylist.top  &&  _dragResult.Y   <= overPlaylist.bottom){
							console.log("over");

							mouseIcon.css({
								'display'   : 'inline',
								'top' 		: event.pageY + 10,
								'left' 		: event.pageX + 10
							});
						}


				}).bind('mouseout', function(){
					mouseIcon.css({
						'display'   : 'none'
					});
				});//MOUSEMOVE






				//Releasing item. Check to see if we're over a playlist
				//otherwise return to original location
				$(document).on('mouseup.dragging', function(event){
					console.log("mouseup in itemDragging in ui");
					//Set item to not dragging !important

					if(moving === true){
						_dragResult.dragging 	= false;
						_setClone 				= false;
					}


					//If over new playlist, drop li-col2 title into input value
					var input 			= getCoordinates('.newPlaylistInput');
					var overPlaylist 	= getCoordinates(_overPlaylist);

						mouseIcon.css({
							'display'   : 'none'
						});


						_clone.css({
							'transition-duration' 	: '1s',
							'cursor' 				: 'pointer'
						});


						//OVER THE CREATE PLAYLIST FORM
						if(_dragResult.X   >= input.left &&  _dragResult.X   <= input.right &&
						   _dragResult.Y   >= input.top  &&  _dragResult.Y   <= input.bottom){

							//Set input value
							var submit = $('input.newPlaylistSubmit');

							//sanitize string
							var sanitized = _clone.text().replace(/[^a-zA-Z ]/g, "")
								sanitized = sanitized.substr(0, 25);

							$('input.newPlaylistInput').val(sanitized);
							submit.attr('data-user', _clone.attr('data-user'));
							submit.attr('data-id', _clone.attr('data-id'));//song id

							//Remove clone from stage
							_clone.fadeOut(function(){
								_clone.remove();
								_clone = '';

								//Unbind move listener
								$(document).unbind('mousemove.dragging');
								//Unbind mouseup listener
								$(document).unbind('mouseup.dragging');
							});



						//OVER A PLAYLIST
						}else if(typeof overPlaylist != 'undefined' && _dragResult.X   >= overPlaylist.left &&  _dragResult.X   <= overPlaylist.right &&
						   		 _dragResult.Y   >= overPlaylist.top  &&  _dragResult.Y   <= overPlaylist.bottom){//Return item to origin position

							var songId 		= _clone.attr('data-id');
							var playlistId 	= _overPlaylist.attr('data-id');
							var user 		= _userId;


							//Add song to playist
							Library.addSongToPlaylist(songId, playlistId, user);

							//Remove clone from stage
							_clone.fadeOut(function(){
								_clone.remove();
								_clone = '';

								//Unbind move listener
								$(document).unbind('mousemove.dragging');
								//Unbind mouseup listener
								$(document).unbind('mouseup.dragging');
							});



						}else{//RETURN TO ORIGINAL LOCATION

							_clone.offset({top: _dragResult.origY, left: _dragResult.origX});

							//Remove clone from stage
							_clone.fadeOut(function(){
								_clone.remove();
								_clone = '';

								//Unbind move listener
								$(document).unbind('mousemove.dragging');
								//Unbind mouseup listener
								$(document).unbind('mouseup.dragging');
							});

						}//else



				});//mouseup
		}//dragging === true
	}





	function getCoordinates(selector){

		if(typeof selector != 'undefined'){

			this.coordinates = {};
			this.item 		= $(selector);
			this.itemLeft 	= this.item.offset().left;
			this.itemRight 	= this.item.offset().left + this.item.width();
			this.itemTop 	= this.item.offset().top;
			this.itemBottom = this.item.offset().top + this.item.height();

			this.coordinates.top 	= this.itemTop,
			this.coordinates.right 	= this.itemRight,
			this.coordinates.bottom = this.itemBottom,
			this.coordinates.left 	= this.itemLeft,
			this.coordinates.height = this.item.height(),
			this.coordinates.width 	= this.item.width();

			return this.coordinates;
		}
	}









	function toggleMobileVideoSizes(thisId){

		if(_previousId !== thisId){

			//Handle mobile video popup
			if(_popupToggle === true){

				videoSizer.normView();

			}else{

				videoSizer.minView();

			}

			//Set previousId for toggle flow
			_previousId = thisId;

		}else{

			//Handle mobile video popup
			if(_popupToggle === false){

				videoSizer.normView();

				_popupToggle = !_popupToggle;

			}else{

				videoSizer.minView();

				_popupToggle = !_popupToggle;

			}//else
		}//else
	}//toggleSizes





















	//methods and properties.
	var exports = {

	};

	//return constructor
	return exports;






});//define()
})();//function