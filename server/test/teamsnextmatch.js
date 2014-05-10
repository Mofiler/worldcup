
var teams = require('../services/teams');
var matches = require('../services/matches');
var list = require('../matches.json');
var simpleflow = require('simpleflow');

matches.useMemory();

function clear(data, next) {
    matches.clear(next);
}

exports['next match is current'] = function (test) {
    test.async();
    
    var list = [
        { local: 'argentina', away: 'brazil', localgoals: 0, awaygoals: 0, venue: 'Venue' }
    ];
    
    var seq = simpleflow.sequence(clear, loadList, getTeams);
    
    seq.run().success(function (teams) {
        test.ok(teams);
        test.ok(Array.isArray(teams));
        test.equal(teams.length, 2);
        test.ok(teams[0].nextmatch);
        test.equal(teams[0].nextmatch.venue, 'Venue');
        test.ok(teams[1].nextmatch);
        test.equal(teams[1].nextmatch.venue, 'Venue');
        test.done();
    });
    
    function loadList(data, next) {
        matches.addList(list, next);
    }
    
    function getTeams(data, next) {
        teams.getList(next);
    }
};

exports['no next match if current is finished'] = function (test) {
    test.async();
    
    var list = [
        { local: 'argentina', away: 'brazil', localgoals: 0, awaygoals: 0, venue: 'Venue', finished: true }
    ];
    
    var seq = simpleflow.sequence(clear, loadList, getTeams);
    
    seq.run().success(function (teams) {
        test.ok(teams);
        test.ok(Array.isArray(teams));
        test.equal(teams.length, 2);
        test.equal(teams[0].nextmatch, null);
        test.equal(teams[1].nextmatch, null);
        test.done();
    });
    
    function loadList(data, next) {
        matches.addList(list, next);
    }
    
    function getTeams(data, next) {
        teams.getList(next);
    }
};

exports['next match'] = function (test) {
    test.async();
    
    var list = [
        { local: 'argentina', away: 'brazil', venue: 'Venue' }
    ];
    
    var seq = simpleflow.sequence(clear, loadList, getTeams);
    
    seq.run().success(function (teams) {
        test.ok(teams);
        test.ok(Array.isArray(teams));
        test.equal(teams.length, 2);
        test.ok(teams[0].nextmatch);
        test.equal(teams[0].nextmatch.venue, 'Venue');
        test.ok(teams[1].nextmatch);
        test.equal(teams[1].nextmatch.venue, 'Venue');
        test.done();
    });
    
    function loadList(data, next) {
        matches.addList(list, next);
    }
    
    function getTeams(data, next) {
        teams.getList(next);
    }
};

exports['next match is current'] = function (test) {
    test.async();
    
    var list = [
        { local: 'argentina', away: 'brazil', venue: 'Venue', date: '20140601', localgoals: 0, awaygoals: 0 },
        { local: 'argentina', away: 'brazil', venue: 'Venue 2', date: '20140620' }
    ];
    
    var seq = simpleflow.sequence(clear, loadList, getTeams);
    
    seq.run().success(function (teams) {
        test.ok(teams);
        test.ok(Array.isArray(teams));
        test.equal(teams.length, 2);
        test.ok(teams[0].nextmatch);
        test.equal(teams[0].nextmatch.venue, 'Venue');
        test.ok(teams[1].nextmatch);
        test.equal(teams[1].nextmatch.venue, 'Venue');
        test.done();
    });
    
    function loadList(data, next) {
        matches.addList(list, next);
    }
    
    function getTeams(data, next) {
        teams.getList(next);
    }
};

exports['next match is future if current is finished'] = function (test) {
    test.async();
    
    var list = [
        { local: 'argentina', away: 'brazil', venue: 'Venue', date: '20140601', localgoals: 0, awaygoals: 0, finished: true },
        { local: 'argentina', away: 'brazil', venue: 'Venue 2', date: '20140620' }
    ];
    
    var seq = simpleflow.sequence(clear, loadList, getTeams);
    
    seq.run().success(function (teams) {
        test.ok(teams);
        test.ok(Array.isArray(teams));
        test.equal(teams.length, 2);
        test.ok(teams[0].nextmatch);
        test.equal(teams[0].nextmatch.venue, 'Venue 2');
        test.ok(teams[1].nextmatch);
        test.equal(teams[1].nextmatch.venue, 'Venue 2');
        test.done();
    });
    
    function loadList(data, next) {
        matches.addList(list, next);
    }
    
    function getTeams(data, next) {
        teams.getList(next);
    }
};
