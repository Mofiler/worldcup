
var matches = require('../services/matches');

function index(req, res) {
    matches.getList(function (err, list) {
        if (err)
            res.render('error', { error: err });
        else
            res.render('matchlist', { title: 'Matches', items: list });
    });
}

function api(req, res) {
    var options = { };
    
    if (req.params && req.params.date)
        options.date = req.params.date;
    
    matches.getList(options, function (err, list) {
        if (err)
            res.render('error', { error: err });
        else
            res.render('matchapi', { items: list });
    });
}

module.exports = {
    index: index,
    api: api
};