
var matches = require('../services/matches');
var simpleflow = require('simpleflow');

function errorfn(err) {
    console.log(err);
}

exports['clear data'] = function (test) {
    test.async();

    matches.useMemory();
    
    matches.clear(function (err, data) {
        test.ok(!err);
        test.done();
    });
};

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

var firstid;

exports['add match'] = function (test) {
    test.async();
    
    var match = { local: 'argentina', away: 'brazil' };
    
    matches.add(match, function (err, id) {
        test.ok(!err);
        test.ok(id);
        firstid = id;
        test.done();
    });
};

exports['update match'] = function (test) {
    test.async();
    
    var match = { local: 'argentina2', away: 'brazil2' };
    
    matches.update(firstid, match, function (err, data) {
        test.ok(!err);
        
        matches.getById(firstid, function (err, item) {
            test.ok(!err);
            test.ok(item);
            test.equal(item.local, match.local);
            test.equal(item.away, match.away);
            test.done();
        });
    });
};

exports['add and get match by id'] = function (test) {
    test.async();
    
    var match = { local: 'argentina', away: 'brazil' };
    
    var flow = simpleflow.sequence(add, getById)
        .success(done)
        .fail(errorfn);
    
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
    
    var flow = simpleflow.sequence(clear, addList, getList)
        .success(done)
        .fail(errorfn);
    
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

exports['load list and delete first item'] = function (test) {
    test.async();
    
    var flow = simpleflow.sequence(clear, addList, getList, remove, getById)
        .success(done)
        .fail(errorfn);
    
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
    
    var firstid;
    
    function remove(list, next) {
        firstid = list[0].id;
        matches.remove(firstid, next);
    }
    
    function getById(data, next) {
        matches.getById(firstid, next);
    }
    
    function done(data) {
        test.equal(data, null);
        test.done();
    }
    
    flow.run();
};

exports['load list using date and get list'] = function (test) {
    test.async();
    
    var flow = simpleflow.sequence(clear, addList, getList)
        .success(done)
        .fail(errorfn);
    
    var list = [
        { local: 'argentina', away: 'brazil', date: '20140610', time: '1900', localgoals: 1, awaygoals: 2 },
        { local: 'bosnia', away: 'germany', date: '20140620', time: '2000', localgoals: 2, awaygoals: 3 }
    ];
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, { date: '20140611' }, next);
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
        test.equal(data[0].localgoals, 1);
        test.equal(data[0].awaygoals, 2);
        test.equal(data[1].local, 'bosnia');
        test.equal(data[1].away, 'germany');
        test.ok(!data[1].hasOwnProperty('localgoals'));
        test.ok(!data[1].hasOwnProperty('awaygoals'));
        
        test.done();
    }
    
    flow.run();
};

exports['load list using date/time and get list'] = function (test) {
    test.async();
    
    var flow = simpleflow.sequence(clear, addList, getList)
        .success(done)
        .fail(errorfn);
    
    var list = [
        { local: 'argentina', away: 'brazil', date: '20140610', time: '1900', localgoals: 1, awaygoals: 2 },
        { local: 'bosnia', away: 'germany', date: '20140620', time: '2000', localgoals: 2, awaygoals: 3 }
    ];
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, { date: '20140620', time: '1800' }, next);
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
        test.equal(data[0].localgoals, 1);
        test.equal(data[0].awaygoals, 2);
        test.equal(data[1].local, 'bosnia');
        test.equal(data[1].away, 'germany');
        test.ok(!data[1].hasOwnProperty('localgoals'));
        test.ok(!data[1].hasOwnProperty('awaygoals'));
        
        test.done();
    }
    
    flow.run();
};


exports['load list using late date/time and get list'] = function (test) {
    test.async();
    
    var flow = simpleflow.sequence(clear, addList, getList)
        .success(done)
        .fail(errorfn);
    
    var list = [
        { local: 'argentina', away: 'brazil', date: '20140610', time: '1900', localgoals: 1, awaygoals: 2 },
        { local: 'bosnia', away: 'germany', date: '20140620', time: '2000', localgoals: 2, awaygoals: 3 }
    ];
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, { date: '20140620', time: '2100' }, next);
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
        test.equal(data[0].localgoals, 1);
        test.equal(data[0].awaygoals, 2);
        test.equal(data[1].local, 'bosnia');
        test.equal(data[1].away, 'germany');
        test.ok(data[1].hasOwnProperty('localgoals'));
        test.ok(data[1].hasOwnProperty('awaygoals'));
        
        test.done();
    }
    
    flow.run();
};

exports['load list and get list'] = function (test) {
    test.async();
    
    var flow = simpleflow.sequence(clear, addList, getList)
        .success(done)
        .fail(errorfn);
    
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

exports['load list using date and get list'] = function (test) {
    test.async();
    
    var flow = simpleflow.sequence(clear, addList, getList)
        .success(done)
        .fail(errorfn);
    
    var list = [
        { local: 'argentina', away: 'brazil', date: '20140610', time: '1900', localgoals: 1, awaygoals: 2 },
        { local: 'bosnia', away: 'germany', date: '20140620', time: '2000', localgoals: 2, awaygoals: 3 }
    ];
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, { date: '20140611' }, next);
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
        test.equal(data[0].localgoals, 1);
        test.equal(data[0].awaygoals, 2);
        test.equal(data[1].local, 'bosnia');
        test.equal(data[1].away, 'germany');
        test.ok(!data[1].hasOwnProperty('localgoals'));
        test.ok(!data[1].hasOwnProperty('awaygoals'));
        
        test.done();
    }
    
    flow.run();
};

exports['load list using date/time and get list'] = function (test) {
    test.async();
    
    var flow = simpleflow.sequence(clear, addList, getList)
        .success(done)
        .fail(errorfn);
    
    var list = [
        { local: 'argentina', away: 'brazil', date: '20140610', time: '1900', localgoals: 1, awaygoals: 2 },
        { local: 'bosnia', away: 'germany', date: '20140620', time: '2000', localgoals: 2, awaygoals: 3 }
    ];
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, { date: '20140615' }, next);
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
        test.equal(data[0].localgoals, 1);
        test.equal(data[0].awaygoals, 2);
        test.equal(data[1].local, 'bosnia');
        test.equal(data[1].away, 'germany');
        test.ok(!data[1].hasOwnProperty('localgoals'));
        test.ok(!data[1].hasOwnProperty('awaygoals'));
        
        test.done();
    }
    
    flow.run();
};

exports['load list and get by criteria'] = function (test) {
    test.async();
    
    var flow = simpleflow.sequence(clear, addList, getOne)
        .success(done)
        .fail(errorfn);
    
    var list = [
        { local: 'argentina', away: 'brazil', date: '20140610', time: '1900', localgoals: 1, awaygoals: 2 },
        { local: 'bosnia', away: 'germany', date: '20140620', time: '2000', localgoals: 2, awaygoals: 3 }
    ];
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, next);
    }
    
    function getOne(data, next) {
        matches.findOne({ local: 'argentina', away: 'brazil', date: '20140610' }, next);
    }
    
    function done(data) {
        test.ok(data);
        test.equal(data.local, 'argentina');
        test.equal(data.away, 'brazil');
        test.equal(data.date, '20140610');
        
        test.done();
    }
    
    flow.run();
};

exports['empty list and get by criteria'] = function (test) {
    test.async();
    
    var flow = simpleflow.sequence(clear, getOne)
        .success(done)
        .fail(errorfn);
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function getOne(data, next) {
        matches.findOne({ local: 'argentina', away: 'brazil', date: '20140610' }, next);
    }
    
    function done(data) {
        test.equal(data, null);
        
        test.done();
    }
    
    flow.run();
};

exports['get list by date'] = function (test) {
    test.async();
    
    var flow = simpleflow.sequence(clear, addList, getList)
        .success(done)
        .fail(errorfn);
    
    var list = require('../matches.json');
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, next);
    }
    
    function getList(data, next) {
        matches.getList({ date: '20140613' }, next);
    }
    
    function done(data) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 3);

        data.forEach(function (match) {
            test.equal(match.date, '20140613');
        });
        
        test.done();
    }
    
    flow.run();
};

