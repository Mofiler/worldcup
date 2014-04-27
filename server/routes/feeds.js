
var feeds = require('../services/feeds');
var config = require('../config.json');

function index(req, res) {
    res.render('feedapply', { title: 'Apply Feed', feed: { url: config.feeds[0] }});
}

function apply(req, res) {
    var url = req.param('feed');
    
    feeds.read(url, function (err, feed) {
        if (err) {
            res.render('error', { error: err });
            return;
        }
        
        feeds.apply(feed, function (err, processed) {
            if (err)
                res.render('error', { error: err });
            else
                res.redirect('/match');
        });
    });
}

module.exports = {
    index: index,
    apply: apply
};
