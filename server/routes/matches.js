
var matches = require('../services/matches');
var config = require('../config.json');
var dates = require('../libs/dates');

function index(req, res) {
    matches.getList(function (err, list) {
        if (err)
            res.render('error', { error: err });
        else
            res.render('matchlist', { title: 'Matches', items: list });
    });
}

function view(req, res) {
    var id = req.params.id;
    
    matches.getById(id, function (err, item) {
        if (err)
            res.render('error', { error: err });
        else
            res.render('matchview', { title: 'Match', item: item });
    });
}

function create(req, res) {
    res.render('matchnew', { title: 'New Match', stages: config.stages });
}

function add(req, res) {
    var match = getMatch(req);
    
    matches.add(match, function (err, item) {
        if (err)
            res.render('error', { error: err });
        else
            index(req, res);
    });
}

function edit(req, res) {
    var id = req.params.id;
    
    matches.getById(id, function (err, item) {
        if (err)
            res.render('error', { error: err });
        else
            res.render('matchedit', { title: 'Edit Match', item: item, stages: config.stages });
    });
}

function update(req, res) {
    var id = req.params.id;
    var match = getMatch(req);
        
    matches.update(id, match, function (err, item) {
        if (err)
            res.render('error', { error: err });
        else
            view(req, res);
    });
}

function remove(req, res) {
    var id = req.params.id;
        
    matches.remove(id, function (err, item) {
        if (err)
            res.render('error', { error: err });
        else
            index(req, res);
    });
}

function api(req, res) {
    var options = { };
    
    if (req.params && req.params.date) {
        options.date = req.params.date;
        options.notfinished = true;
        
        if (req.params.time)
            options.time = req.params.time;
    }
    else {
        var date = new Date();
        options.date = dates.getUTCDate(date);
        options.time = dates.getUTCTime(date);
    }
    
    matches.getList(options, function (err, list) {
        if (err)
            res.render('error', { error: err });
        else {
            res.status(200);
            res.set('Content-Type', 'text/xml');
            if (req.url && req.url.indexOf('datex') >= 0)
                res.render('matchxapi', { items: list });
            else
                res.render('matchapi', { items: list });
        }
    });
}

function apihistory(req, res) {
    var options = { finished: true };
    
    matches.getList(options, function (err, list) {
        if (err)
            res.render('error', { error: err });
        else {
            res.status(200);
            res.set('Content-Type', 'text/xml');
            res.render('matchapih', { items: list });
        }
    });
}

function getMatch(req) {
    var entity = { };
    
    entity.local = req.param('local');
    entity.away = req.param('away');
    
    var localgoals = getInteger(req.param('localgoals'));
    var awaygoals = getInteger(req.param('awaygoals'));
    
    if (localgoals != null)
        entity.localgoals = localgoals;
    if (awaygoals != null)
        entity.awaygoals = awaygoals;

    entity.date = req.param('date');
    entity.time = req.param('time');
    entity.stage = req.param('stage');
    entity.venue = req.param('venue');
    entity.match = req.param('match');
    
    var key = getInteger(req.param('key'));
    
    if (key != null)
        entity.key = key;
        
    entity.finished = req.param('finished') ? true : false;
    
    return entity;
}

function getInteger(text) {
    if (text == null)
        return null;
        
    var value = parseInt(text);
    
    if (value.toString() != text.trim())
        return null;
        
    return value;
}

module.exports = {
    index: index,
    view: view,
    create: create,
    edit: edit,
    update: update,
    remove: remove,
    add: add,
    api: api,
    apihistory: apihistory
};

