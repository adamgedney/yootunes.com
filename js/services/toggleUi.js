(function(){
define(['jquery'], function($){




	//Button/menu interaction controllers====//
	//toggle Controller===========//
	var toggleUi = function(toggle, selector, id){

		var selectorItem 	= $(selector);
		this.toggle 		= toggle;

		//clears previously open li in ul, if open
		selectorItem.fadeOut();

		//Check for provided id
		if(id === null || id === "" || id === undefined){

			//Fade in
			if(!this.toggle){
				selectorItem.fadeIn();

				//custom event for notifying sub menu handler of new sub menu open
				// $.event.trigger({
				// 	type	: "subOpen",
				// 	selector: selector
				// });

			//Fade out
			}else{
				selectorItem.fadeOut();
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



	return toggleUi;





});//define()
})();//function