module.exports.controller = function(app){

	app.get('/play', function(req, res){


		ioServer.sockets.on('connection', function (socket) {

			//Emits to client
			socket.emit('testto', { hello: 'world' });

			//Receives from client emit
			socket.on('testfrom', function (data) {
			  console.log("back and forth working", data);
			});

		});//ioServer


		// res.send('play running', req, res);
	});//.get
};// module

