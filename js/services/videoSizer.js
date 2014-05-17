(function(){
define(['jquery'], function($){


	//CSS breakpoints
	var app_break_smmd 		= '800';


	//Player screensize functions=======//
	//Controls entering fullscreen iframe manipulation
	function enterFullscreen(){

		//hide ads
		$('#adsense').hide();

		if(window.windowWidth < app_break_smmd){

		}else{

			$('#video').css({
				'position' : 'absolute',
				'top'      : '0',
				'bottom'   : '0',
				'left'     : '0',
				'right'    : '0',
				'height'   : '100%',
				'width'    : '100%',
				'display'  : 'block'
			});


			$('div.video-size-ctrl').css({
				'top'     	 : '9px',
				'left' 		 : '9px',
				'background' : 'none',
				'textAlign'  : 'left',
				'border'     : 'none'
			});
		}//else

		//Was set to transparent until FF YT controls started showing
		//FIX THIS LATER
		$('div.footer').css({
			'opacity' : '1'
		});
	}












	//Controls minimizing the video
	function showNormalSize(){
		var videoSizeCtrl = $('div.video-size-ctrl');

		if(window.windowWidth < app_break_smmd){

			//hide ads
			// $('#adsense').hide();

			$('#video-overlay').css({
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

			videoSizeCtrl.hide();

			$('#video').hide();

		}else{


			$('#video').css({
				'height'   : '227px',
				'display'  : 'block',
				'position' : 'absolute',
				'top'      : 'initial',
				'bottom'   : '72px',
				'left'     : '0',
				'right'    : 'initial',
				'width'    : '25%'
			});

			videoSizeCtrl.css({
				'bottom'     : '72px',
				'background' : '#0f1010',
				'textAlign'  : 'right',
				'top'     	 : 'initial',
				'left' 		 : 'initial',
			});
		}
			$('div.footer').css({
				'opacity' : '1'
			});
	}








	//Controls minimizing the video
	function showMinSize(){

		var videoSizeCtrl = $('div.video-size-ctrl');

		if(window.windowWidth < app_break_smmd){

			//Show ads
			// $('#adsense').show();

			$('#video-overlay').css({
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

			videoSizeCtrl.hide();

			$('#video').hide();

		}else{

			$('#video').css({
				'position' : 'absolute',
				'top'      : 'initial',
				'bottom'   : '72px',
				'left'     : '0',
				'right'    : 'initial',
				'height'   : '33px',
				'width'    : '25%'
			});

			videoSizeCtrl.css({
				'bottom'     : '72px',
				'background' : '#0f1010',
				'textAlign'  : 'right',
				'top'     	 : 'initial',
				'left' 		 : 'initial'
			});
		}

			$('div.footer').css({
				'opacity' : '1'
			});
	}




	return {
		minView 	: showMinSize,
		normView	: showNormalSize,
		fullView	: enterFullscreen
	};





});//define()
})();//function