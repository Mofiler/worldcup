
var teams = require('../services/teams');
var matches = require('../services/matches');
var list = require('../matches.json');

exports['load data'] = function (test) {
    test.async();
    
    matches.clear(function (err, data) {
        test.ok(!err);
        
        matches.addList(list, function (err, data) {
            test.ok(!err);
            test.done();
        });
    });
};

exports['get teams'] = function (test) {
    test.async();
    
    teams.getList(function (err, list) {
        test.ok(!err);
        test.ok(list);
        test.ok(Array.isArray(list));
        test.ok(list.length);
        test.equal(list[0].team, 'Brazil');
        test.equal(list[0].matches, 3);
        test.equal(list[0].wins, 1);
        test.equal(list[0].ties, 0);
        test.equal(list[0].losts, 2);
        test.equal(list[0].goals, 4);
        test.done();
    });
};

