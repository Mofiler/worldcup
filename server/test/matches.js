
var matches = require('../services/matches');

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
    
    matches.add(match, function (err, id) {
        test.ok(!err);
        test.ok(id);
        
        matches.getById(id, function (err, item) {
            test.ok(!err);
            test.ok(item);
            test.equal(item.id, id);
            test.equal(item.local, 'argentina');
            test.equal(item.away, 'brazil');
            test.done();
        });
    });
};

exports['load list and get list'] = function (test) {
    test.async();
    
    var list = [
        { local: 'argentina', away: 'brazil' },
        { local: 'bosnia', away: 'germany' }
    ];
    
    matches.clear(function (err, data) {
        test.ok(!err);
        
        matches.addList(list, function (err, data) {
            test.ok(!err);
            
            matches.getList(function (err, data) {
                test.ok(!err);
                test.ok(data);
                test.ok(Array.isArray(data));
                test.equal(data.length, 2);
                
                test.equal(data[0].local, 'argentina');
                test.equal(data[0].away, 'brazil');
                test.equal(data[1].local, 'bosnia');
                test.equal(data[1].away, 'germany');
                test.done();
            });
        });
    });
};

