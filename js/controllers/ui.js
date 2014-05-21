(function(){
define(['jquery', 'toggleUi', 'dragAndDrop', 'videoSizer', 'Library','getCookies', 'slider', 'lightbox', 'tips'],
	function($, toggleUi, dragAndDrop, videoSizer, Library, getCookies, slider, lightbox, tips){


	//private vars
	var _baseUrl 			= 'http://api.atomplayer.com';

	var itemHolding 		= 0;
	var _videoSize 			= {};
		_videoSize.normal 	= false,
		_videoSize.full 	= false;

	var _userId;
	var _dropdownOpen 		= false;
	var _dropdownId 		= '';
	var _popupToggle 		= true;
	var _previousId 		= '';
	var _currentTheme 		= '';
	var _shareUrl;

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


				if(event.template === '#libraryItem' || event.template === '#playlist'){

					//Only run tooltips on desktop machines
					//It's a slow parsing process
					// if(window.windowWidth > app_break_smmd){
					// 	tips();
					// }


				}//if library or playlist rendered



				if(event.template === '#app'){

					//Set the slider functionality
					var thumb 	= '#seek-dot';
					var bar 	= '#seek-bar';
					var fill 	= 'div.seek-fill';
					slider.slider(thumb, bar, fill);


				};




				if(event.template === '#libraryItem'){


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
				// var footer 			= $('div.footer');

				//On resize show sidebar
				if(window.windowWidth > app_break_smmd){
					$('section.app').removeClass('mainSlideLeft');
					$('aside.app').removeClass('sidebarSlideLeft');

					video.show();
					videoSizeCtrl.show();
					// footer.show();
					$('span.li-col1').show();
				}else{
					video.hide();
					videoSizeCtrl.hide();
					// footer.hide();
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
				if(window.dragging === true){
					$('#hiddenCreatePlaylistForm').show();
				}


			});


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
					dragAndDrop(that, evt);
				}, 1000);

			//bind events that can cancel timeout before it runs. Prevents multiple clones
			}).bind('click mouseup mouseleave', '.resultItems', function(){
			    clearTimeout(itemHolding);
			});











			//MOUSEOVER triangle icon hover effect.
			$(document).on('mouseover', '.li-playlist', function(event){
				$('li.li-playlist').find('span.playlist-menu').css({'display' : 'none'});

				$(this).find('span.playlist-menu').css({'display' : 'inline'});

				window.overPlaylist = $(this);
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
					// if(window.state !== "query"){
					// 	//Show last column
					// 	$('span.li-col7').hide();//<----causing add icon to disappear
					// 	$('span.li-col4').css({'width':'16.6666667%'});//2 col Album column

					// 	$(this).find('span.li-col7').show();
					// 	$('span.li-col4').css({'width':'8.33333333%'});//1 col Album col
					// }



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
					// if(window.state !== "query"){
					// 	//Hide last column
					// 	$('span.li-col7').hide();//<----causing add icon to disappear
					// 	$('span.li-col4').css({'width':'16.6666667%'});//2 col Album column
					// }

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

			logging.logPlaylistShare(_userId, playlistId);

		});








		// //Playlist sharing
		// $(document).on('click', '.fbShare, .googleShare, .twitterShare', function(event){
		// 	event.preventDefault();

		// 	//Insert opengraph meta data into head
		// 	var that 			= $(this);
		// 	var titles 			= $('meta.metaTitle');
		// 	var descriptions 	= $('meta.metaDescription');
		// 	var playlistName 	= $(this).attr('data-name');

		// 	var titleMessage = 'I wanted to share my ' + playlistName + ' playlist with you.';
		// 	var descriptionMessage = 'This sweet ' + playlistName + ' playlist was shared by someone on atomplayer.com. The atom Player is an awesome new & free YouTube music library manager. Come see what all the hype is about!';

		// 	// var url;

		// 	//Set the meta info beofre directing user to social media site
		// 	titles.attr('content', titleMessage);
		// 	descriptions.attr('content', descriptionMessage);




		// 	//Determine what was clicked and grab the url
		// 	if(that.hasClass('fbShare')){
		// 		_shareUrl = that.attr('href');
		// 		setTimeout(openSite, 1000);
		// 	}else if(that.hasClass('googleShare')){
		// 		_shareUrl = that.attr('href');
		// 		setTimeout(openSite, 1000);
		// 	}else if(that.hasClass('twitterShare')){
		// 		_shareUrl = that.attr('href');
		// 		setTimeout(openSite, 1000);
		// 	}



		// });

		// function openSite(){
		// 	window.open(_shareUrl);
		// }




















//================================//
//End event logic=================//
//================================//

























//================================//
//Class methods===================//
//================================//





	//Notify user of link to be copied
	function copyToClipboard(link){

	  window.prompt("Copy to clipboard: Ctrl+C, Enter", link);
	}














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