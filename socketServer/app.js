//=======================================================//
//Requires
//=======================================================//

var express         = require('express');
var fs              = require('fs');
var http            = require('http');
var path            = require('path');
var favicon         = require('static-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');

//App instance
var app             = express();












//=======================================================//
//setup configurations
//=======================================================//
app.set('port', process.env.PORT || 3000);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));














//=======================================================//
//development error handler
//will print stacktrace
//=======================================================//
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}












//=======================================================//
//Require all controllers & run their constructors
//to listen for routes
//=======================================================//
fs.readdirSync('./controllers').forEach(function(file){
    if(file.substr(-3) == '.js'){
        var route = require('./controllers/' + file);
        route.controller(app);
    }
});












//=======================================================//
//listen on port 3000
//=======================================================//
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});





module.exports = app;
