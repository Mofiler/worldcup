
var matches = require('../services/matches');

function index(req, res) {
    matches.getList(function (err, list) {
        if (err)
            res.render('error', { error: err });
        else
            res.render('matchlist', { title: 'Matches', items: list });
    });
}

module.exports = {
    index: index
};