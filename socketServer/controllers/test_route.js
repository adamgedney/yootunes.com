module.exports.controller = function(app){

	app.get('/test_route/test_this', function(req, res){

		res.send('test route running test-this', req, res);
	});
};// module

