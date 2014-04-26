
var controller = require('../routes/matches');
var matches = require('../services/matches');
var list = require('../matches.json');

var config = require('../config.json');

matches.useMemory();

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
            test.equal(viewname, 'matchlist');
            test.ok(model);
            test.equal(model.title, 'Matches');
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length);
            test.ok(model.items[0].id);
            test.ok(model.items[0].local);
            test.ok(model.items[0].away);
            test.ok(model.items[0].localgoals);
            test.ok(model.items[0].awaygoals);
            test.ok(model.items[0].date);
            test.ok(model.items[0].time);
            test.ok(model.items[0].venue);
            test.ok(model.items[0].stage);
            test.done();
        }
    };
    
    controller.index(req, res);
};

exports['get view'] = function (test) {
    test.async();
    
    var req = {
            params: { id: 1 }
    };
    var res = {
        render: function (viewname, model) {
            test.ok(viewname);
            test.equal(viewname, 'matchview');
            test.ok(model);
            test.equal(model.title, 'Match');
            test.ok(model.item);
            test.equal(model.item.id, 1);
            test.ok(model.item.id);
            test.ok(model.item.local);
            test.ok(model.item.away);
            test.ok(model.item.localgoals);
            test.ok(model.item.awaygoals);
            test.ok(model.item.date);
            test.ok(model.item.time);
            test.ok(model.item.venue);
            test.ok(model.item.stage);
            test.done();
        }
    };
    
    controller.view(req, res);
};

exports['get create'] = function (test) {
    test.async();
    
    var req = {};
    var res = {
        render: function (viewname, model) {
            test.ok(viewname);
            test.equal(viewname, 'matchnew');
            test.ok(model);
            test.equal(model.title, 'New Match');

            test.ok(model.stages);
            test.ok(Array.isArray(model.stages));
            test.equal(model.stages.length, config.stages.length);
            
            config.stages.forEach(function (stage) {
                test.ok(model.stages.indexOf(stage) >= 0);
            });
            
            test.done();
        }
    };
    
    controller.create(req, res);
};

exports['get edit'] = function (test) {
    test.async();
    
    var req = {
            params: { id: 1 }
    };
    var res = {
        render: function (viewname, model) {
            test.ok(viewname);
            test.equal(viewname, 'matchedit');
            test.ok(model);
            test.equal(model.title, 'Edit Match');
            test.ok(model.item);
            test.equal(model.item.id, 1);
            test.ok(model.item.id);
            test.ok(model.item.local);
            test.ok(model.item.away);
            test.ok(model.item.localgoals);
            test.ok(model.item.awaygoals);
            test.ok(model.item.date);
            test.ok(model.item.time);
            test.ok(model.item.venue);
            test.ok(model.item.stage);

            test.ok(model.stages);
            test.ok(Array.isArray(model.stages));
            test.equal(model.stages.length, config.stages.length);
            
            config.stages.forEach(function (stage) {
                test.ok(model.stages.indexOf(stage) >= 0);
            });
            
            test.done();
        }
    };
    
    controller.edit(req, res);
};

exports['get api with date'] = function (test) {
    test.async();
    
    var req = {
        params: { date: '20140613' }
    };
    
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
            test.equal(viewname, 'matchapi');
            test.ok(model);
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length);
            test.equal(model.items.length, 3);
            test.ok(model.items[0].id);
            test.ok(model.items[0].local);
            test.ok(model.items[0].away);
            test.ok(model.items[0].localgoals);
            test.ok(model.items[0].awaygoals);
            test.ok(model.items[0].date);
            test.ok(model.items[0].time);
            test.ok(model.items[0].venue);
            test.ok(model.items[0].stage);
            test.done();
        }
    };
    
    controller.api(req, res);
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
            test.equal(viewname, 'matchapi');
            test.ok(model);
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length);
            test.ok(model.items[0].id);
            test.ok(model.items[0].local);
            test.ok(model.items[0].away);
            test.ok(model.items[0].localgoals);
            test.ok(model.items[0].awaygoals);
            test.ok(model.items[0].date);
            test.ok(model.items[0].time);
            test.ok(model.items[0].venue);
            test.ok(model.items[0].stage);
            test.done();
        }
    };
    
    controller.api(req, res);
};