
var controller = require('../routes/matches');
var matches = require('../services/matches');
var list = require('../matches.json');
var sf = require('simpleflow');

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

var firstid;

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
            firstid = model.items[0].id;
            test.ok(model.items[0].id);
            test.ok(model.items[0].local);
            test.ok(model.items[0].away);
            test.ok(model.items[0].localgoals);
            test.ok(model.items[0].awaygoals);
            test.ok(model.items[0].date);
            test.ok(model.items[0].time);
            test.ok(model.items[0].venue);
            test.ok(model.items[0].stage);
            test.ok(model.items[0].match);
            test.ok(model.items[0].key);
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
            
            test.equal(model.item.match, "match1");
            test.equal(model.item.key, 1);
            
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

exports['post add'] = function (test) {
    test.async();
    
    var form = {
        local: 'Local Team',
        away: 'Away Team',
        date: 'Date',
        time: 'Time',
        venue: 'Venue',
        stage: 'Stage',
        match: 'Match 1',
        key: '2'
    }
    
    var req = {
        param: function (key) {
            return form[key];
        }
    };
    var res = {
        render: function (viewname, model) {
            test.ok(viewname);
            test.equal(viewname, 'matchlist');
            test.ok(model);
            
            matches.getList(function (err, list) {
                test.ok(!err);
                test.ok(list);
                test.ok(Array.isArray(list));
                test.ok(list.length);
                
                var item = list[list.length - 1];
                
                test.ok(item);
                test.equal(item.local, form.local);
                test.equal(item.localgoals, null);
                test.equal(item.away, form.away);
                test.equal(item.awaygoals, null);
                test.equal(item.date, form.date);
                test.equal(item.time, form.time);
                test.equal(item.venue, form.venue);
                test.equal(item.finished, false);
                test.equal(item.match, 'Match 1');
                test.equal(item.key, 2);
                
                test.done();
            });
        }
    };
    
    controller.add(req, res);
};

exports['post add with goals and finished'] = function (test) {
    test.async();
    
    var form = {
        local: 'Local Team',
        localgoals: '1',
        away: 'Away Team',
        awaygoals: '2',
        date: 'Date',
        time: 'Time',
        venue: 'Venue',
        stage: 'Stage',
        match: '1',
        finished: 'finished'
    }
    
    var req = {
        param: function (key) {
            return form[key];
        }
    };
    var res = {
        render: function (viewname, model) {
            test.ok(viewname);
            test.equal(viewname, 'matchlist');
            test.ok(model);
            
            matches.getList(function (err, list) {
                test.ok(!err);
                test.ok(list);
                test.ok(Array.isArray(list));
                test.ok(list.length);
                
                var item = list[list.length - 1];
                
                test.ok(item);
                test.equal(item.local, form.local);
                test.equal(item.localgoals, 1);
                test.equal(item.away, form.away);
                test.equal(item.awaygoals, 2);
                test.equal(item.date, form.date);
                test.equal(item.time, form.time);
                test.equal(item.venue, form.venue);
                test.equal(item.match, 1);
                test.equal(item.finished, true);
                
                test.done();
            });
        }
    };
    
    controller.add(req, res);
};

exports['get edit'] = function (test) {
    test.async();
    
    var req = {
            params: { id: firstid }
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

exports['post update'] = function (test) {
    test.async();
    
    var form = {
        local: 'Local Team',
        away: 'Away Team',
        date: 'Date',
        time: 'Time',
        venue: 'Venue',
        stage: 'Stage'
    }
    
    var req = {
        params: {
            id: firstid
        },
        param: function (key) {
            return form[key];
        }
    };
    
    var res = {
        render: function (viewname, model) {
            test.ok(viewname);
            test.equal(viewname, 'matchview');
            test.ok(model);
            test.equal(model.title, 'Match');
            test.ok(model.item);
            
            test.equal(model.item.id, firstid);
            test.equal(model.item.local, form.local);
            test.equal(model.item.away, form.away);
            test.equal(model.item.localgoals, null);
            test.equal(model.item.awaygoals, null);
            test.equal(model.item.date, form.date);
            test.equal(model.item.time, form.time);
            test.equal(model.item.venue, form.venue);
            test.equal(model.item.stage, form.stage);
            test.equal(model.item.match, null);
            test.ok(!model.item.finished);
            
            test.done();
        }
    };
    
    controller.update(req, res);
};

exports['get remove'] = function (test) {
    test.async();
    
    var req = {
        params: {
            id: firstid
        }
    };
    
    var res = {
        render: function (viewname, model) {
            test.ok(viewname);
            test.equal(viewname, 'matchlist');
            test.ok(model);
            test.equal(model.title, 'Matches');
            test.ok(model.items);

            model.items.forEach(function (item) {
                test.ok(item.id != firstid);
            });
            
            test.done();
        }
    };
    
    controller.remove(req, res);
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

exports['get api using now'] = function (test) {
    test.async();
    
    var seq = sf.sequence(clear, addList);    
    
    var list = [
        { local: 'spain', away: 'brazil', date: '20140101' },
        { local: 'argentina', away: 'brazil', date: '20140102' },
        { local: 'bosnia', away: 'germany', date: '20140102', finished: true }
    ];
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, next);
    }
    
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
            test.equal(model.items.length, 0);
            test.done();
        }
    };
    
    seq.run().success(function () { controller.api(req, res); });
};

exports['get api with date excluding finished'] = function (test) {
    test.async();
    
    var seq = sf.sequence(clear, addList);    
    
    var list = [
        { local: 'spain', away: 'brazil', date: '20140612' },
        { local: 'argentina', away: 'brazil', date: '20140613' },
        { local: 'bosnia', away: 'germany', date: '20140613', finished: true }
    ];
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, next);
    }
    
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
            test.equal(model.items.length, 1);
            test.equal(model.items[0].local, 'argentina');
            test.equal(model.items[0].away, 'brazil');
            test.done();
        }
    };
    
    seq.run().success(function () { controller.api(req, res); });
};

exports['get api with date time excluding finished and not started'] = function (test) {
    test.async();
    
    var seq = sf.sequence(clear, addList);    
    
    var list = [
        { local: 'spain', away: 'brazil', date: '20140612' },
        { local: 'argentina', away: 'brazil', date: '20140613', time: '1800' },
        { local: 'uruguay', away: 'chile', date: '20140613', time: '2000' },
        { local: 'bosnia', away: 'germany', date: '20140613', finished: true }
    ];
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, next);
    }
    
    var req = {
        params: { date: '20140613', time: '1800' }
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
            test.equal(model.items.length, 1);
            test.equal(model.items[0].local, 'argentina');
            test.equal(model.items[0].away, 'brazil');
            test.done();
        }
    };
    
    seq.run().success(function () { controller.api(req, res); });
};

exports['get api history'] = function (test) {
    test.async();
    
    var seq = sf.sequence(clear, addList);    
    
    var list = [
        { local: 'spain', away: 'brazil', date: '20140612' },
        { local: 'argentina', away: 'brazil', date: '20140613', time: '1800' },
        { local: 'uruguay', away: 'chile', date: '20140613', time: '2000' },
        { local: 'bosnia', away: 'germany', date: '20140613', finished: true, match: '1' }
    ];
    
    function clear(data, next) {
        matches.clear(next);
    }
    
    function addList(data, next) {
        matches.addList(list, next);
    }
    
    var req = {
        params: { }
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
            test.equal(viewname, 'matchapih');
            test.ok(model);
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length);
            test.equal(model.items.length, 1);
            test.equal(model.items[0].local, 'bosnia');
            test.equal(model.items[0].away, 'germany');
            test.equal(model.items[0].match, '1');
            test.done();
        }
    };
    
    seq.run().success(function () { controller.apihistory(req, res); });
};
