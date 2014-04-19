
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var engine = require('ejs-locals')
var http = require('http');
var path = require('path');

var matches = require('./routes/matches');
var teams = require('./routes/teams');
var smatches = require('./services/matches');

var app = express();

app.engine('ejs', engine);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/match', matches.index);
app.get('/team', teams.index);
app.get('/api/team', teams.api);

smatches.addList(require('./matches.json'), function (err, data) {
    if (err) {
        console.log(err);
        return;
    }

    smatches.getList(function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        
        http.createServer(app).listen(app.get('port'), function(){
          console.log('Express server listening on port ' + app.get('port'));
        });
    });
});

