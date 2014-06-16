
var feeds = require('../services/feeds');
var matches = require('../services/matches');
var sf = require('simpleflow');

exports['clear data'] = function (test) {
    test.async();

    matches.useMemory();
    
    matches.clear(function (err, data) {
        test.ok(!err);
        test.done();
    });
};

exports['load new tipgin live score'] = function (test) {
    test.async();
    
    feeds.read('http://www.tipgin.net/datav2/accounts/btafel/soccer/livescore/livescore.xml', function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.equal(typeof data, 'object');
        test.done();
    });
};

