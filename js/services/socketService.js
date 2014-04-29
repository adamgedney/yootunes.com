(function(){
define(['jquery', 'getCookies'], function($, getCookies){




	//private vars
	var _userId;
	var _playonDevice;
	var _thisDevice;

	var server 	= 'http://yooss.pw';


	var socket = io.connect(server);;













	//constructor function
	var SocketService = function(){












	};//constructor
	//=========================//











	//methods and properties.
	obj = {
		createRoom 		: createRoom,
		joinRoom 		: joinRoom,
		disconnectRoom 	: disconnectRoom,
		socket 			: socket
	};





	//return public methods
	return obj;









//================================//
//Class methods===================//
//================================//



	function createRoom(userId){
		console.log("createRoom called", userId);
		socket.emit('createRoom', userId);

	}




	function joinRoom(userId){
		console.log("joinRoom called", userId);
		socket.emit('joinRoom', userId);

	}




	function disconnectRoom(userId){
		console.log("disconnectRoom called", userId);
		_socketConnect.emit('discon', userId);
	}















});//define()
})();//function