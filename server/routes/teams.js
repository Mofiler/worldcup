
var teams = require('../services/teams');

function index(req, res) {
    teams.getList(function (err, list) {
        if (err)
            res.render('error', { error: err });
        else
            res.render('teamlist', { title: 'Teams', items: list });
    });
}

function api(req, res) {
    teams.getList(function (err, list) {
        if (err)
            res.render('error', { error: err });
        else {
            res.status(200);
            res.set('Content-Type', 'text/xml');
            res.render('teamapi', { title: 'Teams', items: list });
        }
    });
}

module.exports = {
    index: index,
    api: api
};