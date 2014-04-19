
var matches = require('../services/matches');
var simpleflow = require('simpleflow');

function errorfn(err) {
    console.log(err);
}

exports['get empty list'] = function (test) {
    test.async();
    matches.getList(function (err, list) {
        test.ok(!err);
        test.ok(list);
        test.ok(Array.isArray(list));
        test.equal(list.length, 0);
        test.done();
    });
};

exports['add match'] = function (test) {
    test.async();
    
    var match = { local: 'argentina', away: 'brazil' };
    
    matches.add(match, function (err, id) {
        test.ok(!err);
        test.ok(id);
        test.done();
    });
};

exports['add and get match by id'] = function (test) {
    test.async();
    
    var match = { local: 'argentina', away: 'brazil' };
    
    var flow = simpleflow.createFlow([add, getById, done], errorfn);
    
    flow.run(match);
    
    function add(data, next) {
        matches.add(data, next);
    }
    
    var id;
    
    function getById(data, next) {
        id = data;
        matches.getById(id, next);
    }
    
    function done(item) {
        test.ok(item);
        test.equal(item.id, id);
        test.equal(item.local, 'argentina');
        test.equal(item.away, 'brazil');
        test.done();
    };
};

exports['load list and get list'] = function (test) {
    test.async();
    
    var flow = simpleflow.createFlow([clear, addList, getList, done], errorfn);
    
    var list = [
        { local: 'argentina', away: 'brazil' },
        { local: 'bosnia', away: 'germany' }
    ];
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, next);
    }
    
    function getList(data, next) {
        matches.getList(next);
    }
    
    function done(data) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 2);
        
        test.equal(data[0].local, 'argentina');
        test.equal(data[0].away, 'brazil');
        test.equal(data[1].local, 'bosnia');
        test.equal(data[1].away, 'germany');
        test.done();
    }
    
    flow.run();
};

