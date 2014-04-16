module.exports.controller = function(app){

	app.get('/play', function(req, res){

		res.send('play running', req, res);
	});
};// module

