(function(){
define(['jquery', 'getCookies', ], function($, getCookies){




	//private vars
	var _userId;
	var _playonDevice;
	var _thisDevice;

	var server 	= 'http://yooss.pw:3001';
	var socket = io.connect(server);











	//constructor function
	var SocketService = function(){












	};//constructor
	//=========================//











	//methods and properties.
	obj = {
		createRoom 	: createRoom,
		joinRoom 	: joinRoom,
		socket 		: socket
	};





	//return public methods
	return obj;









//================================//
//Class methods===================//
//================================//



	function createRoom(userId){

		_socket.emit('createRoom', userId);

	}




	function joinRoom(userId){

		_socket.emit('joinRoom', userId);

	}















});//define()
})();//function