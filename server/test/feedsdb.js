
var feeds = require('../services/feeds');
var matches = require('../services/matches');
var sf = require('simpleflow');
var config = require('../config');
var mongodb = require('../libs/mongodb');

var db;


exports['use database'] = function (test) {
    test.async();
    
    mongodb.openDatabase(config.database + '-test', config.mongodb.host, config.mongodb.port, function (err, newdb) {
        test.ok(!err);
       
        db = newdb;
        
        matches.useDatabase(newdb);
        
        matches.clear(function (err) {
            test.ok(!err);
            test.done();
        });
    });
}

exports['load matches list and apply feed'] = function (test) {
    test.async();

    var seq = sf.sequence(clear, addList, applyFeed, getList)
        .success(function (list) {
            test.ok(list);
            test.equal(list.length, 2);
            /*
            test.equal(list[1].local, 'Tigre');
            test.strictEqual(list[1].localgoals, 0);
            test.equal(list[1].away, 'AllBoys');
            test.strictEqual(list[1].awaygoals, 0);

            test.equal(list[0].local, 'RosarioCentral');
            test.equal(list[0].localgoals, null);
            test.equal(list[0].away, 'Belgrano');
            test.equal(list[0].awaygoals, null);
            */

            test.done();
        })
        .fail(function (err) {
            console.log(err);
            test.done();
        })
    
    var list = [
        { local: 'Tigre', away: 'AllBoys', date: '20140411' },
        { local: 'RosarioCentral', away: 'Belgrano', date: '20140411' }
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

exports['load matches list and apply feed world cup data'] = function (test) {
    test.async();

    var seq = sf.sequence(clear, addList, applyFeed, getList)
        .success(function (list) {
            test.ok(list);
            test.equal(list.length, 3);
/*
            test.equal(list[0].local, 'IvoryCoast');
            test.strictEqual(list[0].localgoals, 2);
            test.equal(list[0].away, 'Japan');
            test.strictEqual(list[0].awaygoals, 1);
            test.ok(list[0].finished);

            test.equal(list[1].local, 'Switzerland');
            test.strictEqual(list[1].localgoals, 2);
            test.equal(list[1].away, 'Ecuador');
            test.strictEqual(list[1].awaygoals, 1);
            test.ok(list[1].finished);

            test.equal(list[2].local, 'France');
            test.equal(list[2].localgoals, null);
            test.equal(list[2].away, 'Honduras');
            test.equal(list[2].awaygoals, null);
            test.equal(list[2].finished, null);
*/
            test.done();
        })
        .fail(function (err) {
            console.log(err);
            test.done();
        });
    
    var list = [
        { local: 'IvoryCoast', away: 'Japan', date: '20140615' },
        { local: 'Switzerland', away: 'Ecuador', date: '20140615' },
        { local: 'France', away: 'Honduras', date: '20140615' }
    ];
        
    seq.run();
        
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, next);
    }
    
    function applyFeed(data, next) {
        var feed = require('./livescore2.json');
        feeds.apply(feed, next);
    }
    
    function getList(data, next) {
        matches.getList(next);
    }
};

exports["Close database"] = function (test) {
    db.close();
    test.done();
};
