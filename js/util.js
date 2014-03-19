//@codekit-prepend "jquery-1.10.2.min.js"
//@codekit-prepend "init.js"
//@codekit-prepend "jquery.parallax.min.js"
//@codekit-prepend "jquery.event.special.js"
//@codekit-prepend "jquery.easing.min.js"
//@codekit-prepend "lightbox-2.6.min.js"



//namespace
$(function(){


//-----------------------------------------Datetime generator--------------------------------------
	function get_datetime(){
		// datetime on 12 hr clock
		var d = new Date();
		var	day = d.getDay();
		var month = d.getMonth() + 1;
		var year = d.getFullYear();
		var hour = d.getHours();
		var minutes = d.getMinutes();
		var time;
		if(hour > 12){
			hour = hour - 12;
			time = hour + ":" + minutes;

			time += "pm";
		}

		return month + "/" + day + "/" + year + " " + time;
	};


	

//-------------------------------------------Validate contact form---------------------------------
$('#submit-btn').on("click", function(e){

	var email = $('#con-email').val();
	var phone = $('#con-phone').val();
	var message = $('#con-message').val();

	var emailPat = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/; // standard email validation
	var phonePat = /^[2-9]\d{2}-\d{3}-\d{4}$/; //845-216-5030 


	//contact form validation conditions
	if(!emailPat.test(email)){

		e.preventDefault();
		$('[name=email]').css('background', '#ff0000');
	}else if(!phonePat.test(phone)){

		e.preventDefault();
		$('[name=phone]').css('background', '#ff0000');
	}else if(message == "" || message == null){

		e.preventDefault();
		$('[name=message]').css('background', '#ff0000');
	}else{

		return "true";
	}

});// Validate Contact
















});// function