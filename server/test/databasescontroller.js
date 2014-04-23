
var databases = require('../routes/databases'),
    matches = require('../services/matches'),
    config = require('../config.json'),
    mongodb = require('../libs/mongodb');

var db;

exports['Open database'] = function (test) {
    test.async();
    mongodb.openDatabase(config.database + '-test', config.mongodb.host, config.mongodb.port, function (err, newdb) {
        test.equal(err, null);
        test.ok(newdb);
        databases.useDatabase(newdb);
        db = newdb;
        test.done();
    });
};

exports['Get databases'] = function (test) {
    test.async();
    
    var res = {
        render: function (name, model) {
            test.equal(name, 'databaselist');
            test.ok(model);
            test.equal(model.title, 'Databases');
            test.equal(model.currentdbname, config.database + '-test');
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length > 0);
            
            test.done();
        }
    };
    
    databases.index({ }, res);
};

exports['Clear database'] = function (test) {
    test.async();
    
    var req = {
        params: {
            dbname: config.database + '-test'
        }
    }
    
    var res = {
        render: function (name, model) {
            test.equal(name, 'databaselist');
            test.ok(model);
            test.equal(model.title, 'Databases');
            test.equal(model.currentdbname, config.database + '-test');
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length > 0);
            
            matches.getList(step2);
        }
    };
    
    function step2(err, items) {
        test.equal(err, null);
        test.ok(items);
        test.ok(Array.isArray(items));
        test.equal(items.length, 0);
        
        test.done();
    }
    
    databases.cleardb(req, res);
};

exports['Load database'] = function (test) {
    test.async();
    
    var req = {
        params: {
            dbname: config.database + '-test'
        }
    }
    
    var res = {
        render: function (name, model) {
            test.equal(name, 'databaselist');
            test.ok(model);
            test.equal(model.title, 'Databases');
            test.equal(model.currentdbname, config.database + '-test');
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length > 0);
            
            matches.getList(step2);
        }
    };
    
    function step2(err, items) {
        test.equal(err, null);
        test.ok(items);
        test.ok(Array.isArray(items));
        test.ok(items.length);
        
        test.done();
    }
    
    databases.loaddb(req, res);
};

exports["Close database"] = function (test) {
    test.async();
    
    mongodb.closeCurrentDatabase(function (err, result) {
        test.equal(err, null);
        test.done();
    });
};

