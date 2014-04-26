
var feeds = require('../services/feeds');
var config = require('../config.json');

function index(req, res) {
    res.render('feedapply', { title: 'Apply Feed', feed: { url: config.feeds[0] }});
}

function apply(req, res) {
    var url = req.params.feed;
    feeds.apply(url, function (err, list) {
        if (err)
            res.render('error', { error: err });
        else
            res.redirect('/match');
    });
}

module.exports = {
    index: index,
    apply: apply
};
