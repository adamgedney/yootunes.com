(function(){
define(['jquery', 'qtip'], function($, qtip){


	//QTip renders title attributes as a tooltip.
	//Configured to display in top right corner.
	//DOM parsing is a bit slow

	//============================//
	//Enable QTIP on all title attr
	//============================//




	var tips = function(){

		$(document).find('[title]').qtip({
			style: {
				classes: 'qtip-tipsy'
			},
			position: {
				target: [9, 9]
		    },
		    show: {
		        delay: 1000
		    },
		    hide: {
		    	event: 'click mouseleave',
		        delay: 500
		    }
		});//qTip
	}//tips




	return tips;





});//define()
})();//function