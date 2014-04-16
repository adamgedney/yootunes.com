module.exports.controller = function(app){

	app.get('/next_track', function(req, res){

		res.send('next_track', req, res);
		//wow
	});
};// module

