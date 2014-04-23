
var matches = require('../services/matches');

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

function edit(req, res) {
    var id = req.params.id;
    
    matches.getById(id, function (err, item) {
        if (err)
            res.render('error', { error: err });
        else
            res.render('matchedit', { title: 'Edit Match', item: item });
    });
}

function api(req, res) {
    var options = { };
    
    if (req.params && req.params.date)
        options.date = req.params.date;
    
    matches.getList(options, function (err, list) {
        if (err)
            res.render('error', { error: err });
        else {
            res.status(200);
            res.set('Content-Type', 'text/xml');
            res.render('matchapi', { items: list });
        }
    });
}

module.exports = {
    index: index,
    view: view,
    edit: edit,
    api: api
};