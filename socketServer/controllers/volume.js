module.exports.controller = function(app){

	app.get('/volume', function(req, res){

		res.send('volume running', req, res);
	});
};// module

