
var teams = require('../services/teams');
var matches = require('../services/matches');
var list = require('../matches.json');

exports['load data'] = function (test) {
    test.async();
    
    matches.clear(function (err, data) {
        test.ok(!err);
        
        matches.addList(list, { date: '20140613' }, function (err, data) {
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
        test.equal(list[0].team, 'Australia');
        test.equal(list[1].team, 'Brazil');
        test.equal(list[1].matches, 1);
        test.equal(list[1].wins, 1);
        test.equal(list[1].ties, 0);
        test.equal(list[1].losts, 0);
        test.equal(list[1].goals, 2);
        test.equal(list[1].owngoals, 1);
        test.ok(list[1].nextmatch);
        test.equal(list[1].nextmatch.local, 'Brazil');
        test.equal(list[1].nextmatch.away, 'Mexico');
        test.equal(list[1].nextmatch.date, '20140617');
        test.equal(list[1].nextmatch.time, '1900');
        test.equal(list[1].nextmatch.stage, 'Group A');
        test.equal(list[1].nextmatch.venue, 'Estadio Castelao');
        test.done();
    });
};

