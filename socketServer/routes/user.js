var express = require('express');
// var router 	= express.Router();
// var tc 		= require('../controllers/testRoute.js');


//index route
router.get('/', function(req, res) {
  res.send('respond with a resource', req, res);


  	  tc.test(req, res);
});



router.get('/ss/balls', function(req, res) {
  res.send('respond with a resource', req, res);


  	  tc.test(req, res);
});



module.exports = router;
