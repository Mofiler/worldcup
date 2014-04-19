
var controller = require('../routes/matches');
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
            test.equal(viewname, 'matchlist');
            test.ok(model);
            test.equal(model.title, 'Matches');
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length);
            test.ok(model.items[0].id);
            test.ok(model.items[0].local);
            test.ok(model.items[0].away);
            test.done();
        }
    };
    
    controller.index(req, res);
};