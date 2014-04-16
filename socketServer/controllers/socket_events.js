module.exports.controller = function(app){

	app.get('/socket_events', function(req, res){


		ioServer.sockets.on('connection', function (socket) {

			//Receives from client emit
			socket.on('play', function (data) {
			  console.log("back and forth working", data);

			  //Broadcast message to listening clients
			  socket.emit('playOn', data);
			});

		});//ioServer
	});//.get
};// module

