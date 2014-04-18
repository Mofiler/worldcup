
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

