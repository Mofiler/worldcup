
var controller = require('../routes/teams');
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

exports['get index'] = function (test) {
    test.async();
    
    var req = {};
    var res = {
        render: function (viewname, model) {
            test.ok(viewname);
            test.equal(viewname, 'teamlist');
            test.ok(model);
            test.equal(model.title, 'Teams');
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length);
            test.ok(model.items[0].team);
            test.ok(model.items[0].hasOwnProperty('matches'));
            test.ok(model.items[0].hasOwnProperty('wins'));
            test.ok(model.items[0].hasOwnProperty('losts'));
            test.ok(model.items[0].hasOwnProperty('ties'));
            test.ok(model.items[0].hasOwnProperty('goals'));
            test.ok(model.items[0].hasOwnProperty('owngoals'));
            test.done();
        }
    };
    
    controller.index(req, res);
};

exports['get api'] = function (test) {
    test.async();
    
    var req = {};
    var res = {
        status: function(status) {
            test.equal(status, 200);
        },
        set: function (name, value) {
            test.equal(name, 'Content-Type');
            test.equal(value, 'text/xml');
        },
        render: function (viewname, model) {
            test.ok(viewname);
            test.equal(viewname, 'teamapi');
            test.ok(model);
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length);
            test.ok(model.items[0].team);
            test.ok(model.items[0].hasOwnProperty('matches'));
            test.ok(model.items[0].hasOwnProperty('wins'));
            test.ok(model.items[0].hasOwnProperty('losts'));
            test.ok(model.items[0].hasOwnProperty('ties'));
            test.ok(model.items[0].hasOwnProperty('goals'));
            test.ok(model.items[0].hasOwnProperty('owngoals'));
            test.ok(model.items[0].hasOwnProperty('secondround'));
            test.ok(model.items[0].hasOwnProperty('quarterfinals'));
            test.ok(model.items[0].hasOwnProperty('semifinals'));
            test.ok(model.items[0].hasOwnProperty('finals'));
            test.done();
        }
    };
    
    controller.api(req, res);
};


