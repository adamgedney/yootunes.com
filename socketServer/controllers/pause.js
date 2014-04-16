module.exports.controller = function(app){

	app.get('/pause', function(req, res){

		res.send('pause running', req, res);
	});
};// module

