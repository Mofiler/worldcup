
var teams = require('../services/teams');

function index(req, res) {
    teams.getList(function (err, list) {
        if (err)
            res.render('error', { error: err });
        else
            res.render('teamlist', { title: 'Teams', items: list });
    });
}

module.exports = {
    index: index
};