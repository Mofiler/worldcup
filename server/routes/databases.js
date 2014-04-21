
var mongodb = require('../libs/mongodb');
var matches = require('../services/matches');
var config = require('../config.json');
var sf = require('simpleflow');

var db;
var usememory = false;

function errorFn(res) {
    return function (err) {
        res.render('error', { title: 'Error', error: err });
    };
}

function openDatabase(dbname, next) {
    mongodb.openDatabase(dbname, config.mongodb.host, config.mongodb.port, next);
}

function useDatabase(newdb) {
    db = newdb;
}

function index(req, res) {
    if (!mongodb.getCurrentDatabaseName())
        usememory = true;
        
    sf.createFlow([step1, step2], errorFn(res)).run();
        
    function step1(value, next) {
        db.admin().listDatabases(next);
    }
    
    function step2(result, next) {
        var items = [];
        
        result.databases.forEach(function (db) {
            items.push(db.name);
        });
        
        res.render('databaselist', { title: 'Databases', items: items, currentdbname: usememory ? null : mongodb.getCurrentDatabaseName() });
    }
}

function usedb(req, res) {
    sf.createFlow([openDatabase, step2], errorFn(res)).run(req.params.dbname);

    function step2(newdb, next) {
        db = newdb;
        
        matches.useDatabase(newdb);
        useDatabase(newdb);
        
        usememory = false;
        
        index(req,res);
    };
}

function createdb(req, res) {
    sf.createFlow([openDatabase, step2, step3], errorFn(res)).run(req.param("dbname"));

    function step2(newdb, next) {
        db = newdb;
        
        matches.useDatabase(newdb);
        useDatabase(newdb);
                
        usememory = false;
        
        matches.getList(next);
    }
    
    function step3(value, next) {
        index(req, res);
    }
}

function usemem(req, res) {
    matches.useMemory();
    
    index(req,res);
}

function clearmem(req, res) {
    matches.clearMemory();
    
    index(req,res);
}

function cleardb(req, res) {
    var original = mongodb.getCurrentDatabaseName();
    
    sf.createFlow([openDatabase, step1, step2, step3, step4], errorFn(res)).run(req.params.dbname);

    function step1(newdb, next) {
        matches.useDatabase(newdb);
        useDatabase(newdb);
        
        matches.clear(next);
    };
    
    function step2(result, next) {
        next(null, null);
    }
    
    function step3(result, next) {
        if (!original || original == req.params.dbname) {
            index(req, res);
            return;
        }

        openDatabase(original, next);
    }
    
    function step4(newdb, next) {
        matches.useDatabase(newdb);
        useDatabase(newdb);
        
        index(req, res);
    }
}

module.exports = {
    useDatabase: useDatabase,
    index: index,
    usedb: usedb,
    cleardb: cleardb,
    createdb: createdb,
    clearmem: clearmem,
    usemem: usemem
};

