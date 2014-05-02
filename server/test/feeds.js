
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

exports['load tipgin live score'] = function (test) {
    test.async();
    
    feeds.read('http://www.tipgin.net/example-data/livescore-feed-example.xml', function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.equal(typeof data, 'object');
        test.done();
    });
};

exports['load matches list and apply feed'] = function (test) {
    test.async();

    var seq = sf.sequence(clear, addList, applyFeed, getList)
        .success(function (list) {
            test.ok(list);
            test.equal(list.length, 2);
            test.equal(list[0].local, 'Tigre');
            test.strictEqual(list[0].localgoals, 0);
            test.equal(list[0].away, 'All Boys');
            test.strictEqual(list[0].awaygoals, 0);

            test.equal(list[1].local, 'Rosario Central');
            test.equal(list[1].localgoals, null);
            test.equal(list[1].away, 'Belgrano');
            test.equal(list[1].awaygoals, null);

            test.done();
        })
    
    var list = [
        { local: 'Tigre', away: 'All Boys', date: '20140411' },
        { local: 'Rosario Central', away: 'Belgrano', date: '20140411' }
    ];
        
    seq.run();
        
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, next);
    }
    
    function applyFeed(data, next) {
        var feed = require('./livescore.json');
        feeds.apply(feed, next);
    }
    
    function getList(data, next) {
        matches.getList(next);
    }
};

