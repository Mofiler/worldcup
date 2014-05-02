
// require('daemon')();

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var engine = require('ejs-locals')
var http = require('http');
var path = require('path');
var args = require('simpleargs');

// Configuration

var config = require('./config.json');

// Controllers

var matches = require('./routes/matches');
var teams = require('./routes/teams');
var feeds = require('./routes/feeds');
var databases = require('./routes/databases');

// Services

var smatches = require('./services/matches');

// MongoDB

var mongodb = require('./libs/mongodb');

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
app.get('/match/new', matches.create);
app.post('/match/new', matches.add);
app.get('/match/:id', matches.view);
app.get('/match/:id/edit', matches.edit);
app.post('/match/:id/edit', matches.update);
app.get('/match/:id/remove', matches.remove);
app.get('/team', teams.index);
app.get('/api/team', teams.api);
app.get('/api/match/now', matches.api);
app.get('/api/match/history', matches.apihistory);
app.get('/api/match/date/:date', matches.api);
app.get('/api/match/date/:date/time/:time', matches.api);

app.get('/feed', feeds.index);
app.post('/feed', feeds.apply);

app.get('/admin/database', databases.index);
app.get('/admin/database/usedb/:dbname', databases.usedb);
app.get('/admin/database/cleardb/:dbname', databases.cleardb);
app.post('/admin/database/createdb', databases.createdb);
app.get('/admin/database/loaddb/:dbname', databases.loaddb);
app.get('/admin/database/usemem', databases.usemem);
app.get('/admin/database/clearmem', databases.clearmem);
app.get('/admin/database/loadmem', databases.loadmem);

args.define('t', 'time', null, 'Current time');
args.define('d', 'date', null, 'Current date');

var options = args.process(process.argv);
databases.options(options);

mongodb.openDatabase(config.database, config.mongodb.host, config.mongodb.port, function (err, newdb) {
    if (err)
        console.log(err);
    else {
        smatches.useDatabase(newdb);
        databases.useDatabase(newdb);
    }

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
});
