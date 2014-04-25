
var feeds = require('../services/feeds');

exports['load tipgin live score'] = function (test) {
    test.async();
    
    feeds.read('http://www.tipgin.net/example-data/livescore-feed-example.xml', function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.equal(typeof data, 'object');
        test.done();
    });
};