module.exports.controller = function(app){

	app.get('/prev_track', function(req, res){

		res.send('prev_track running', req, res);
	});
};// module

