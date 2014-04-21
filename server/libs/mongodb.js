
var mongodb = require('mongodb');

var currentdb;
var currentdbname;

function Repository(db, name) {
    function getCollection(callback) {
        db.collection(name, function (err, collection) {
            if (err)
                callback(err);
            else
                callback(null, collection);
        });
    }
    


    this.findDistinct = function (distinct, query, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else {
                collection.distinct(distinct, query, function(err, collection) {
                    if(err)
                        callback(err);
                    else
                        callback(null, collection);
                });
            }
        });
    };

    this.aggregate = function (aggregate,callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else {
                collection.aggregate(aggregate,function(err,collection){
                    if(err)
                        callback(err);
                    else
                        callback(null, collection);
                });
            }
        });
    };

    this.findAll = function (callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else {
                collection.find().toArray(function (err, collection) {
                    if (err)
                        callback(err);
                    else
                        callback(null, collection);
                });
            }
        });
    };
    

    this.findGetCursor = function(query, options, cb) {
        getCollection(function (err, collection) {
            if (err)
                cb(err, null);
            else {
                cb(null, collection.find(query, options));
            }            
        });
    };

    this.find = function (query, options, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else {
                if (typeof options === 'function' && !callback) {
                    callback = options;
                    options = null;
                }
                if(options) {
                    collection.find(query, options).toArray(function (err, collection) {
                        if (err)
                            callback(err);
                        else
                            callback(null, collection);
                    });
                }
                else {
                    collection.find(query).toArray(function (err, collection) {
                        if (err)
                            callback(err);
                        else
                            callback(null, collection);
                    });                    
                }
            }
        });
    };
    
    this.findOne = function (query, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.findOne(query, callback);
        });
    };
    
    this.insert = function (item, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.insert(item, { safe: true }, callback);
        });
    };
    
    this.update = function (id, item, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.update({ _id: collection.db.bson_serializer.ObjectID.createFromHexString(id) }, item, { safe: true }, callback);
        });
    };
    
    this.upsert = function (query, item, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.update(query, item, { upsert: true, safe: true }, callback);
        });
    };
    
    this.remove = function (id, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.remove({ _id: collection.db.bson_serializer.ObjectID.createFromHexString(id) }, callback);
        });
    };
    
    this.findById = function (id, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.findOne({ _id: collection.db.bson_serializer.ObjectID.createFromHexString(id) }, callback);
        });
    };
    
    this.clear = function (callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.remove(callback);
        });
    };
};

module.exports = {
    createRepository: function (db, name) { return new Repository(db, name); },
    openDatabase: function (dbname, host, port, cb) {
        if (currentdb)
            this.closeDatabase(currentdb, step1);
        else
            return step1(null, null);
        
        function step1(err, result) {
            if (err) {
                cb(err, null);
                return;
            }
            
            if (!cb)
                cb = function () { };
            var db = new mongodb.Db(dbname, new mongodb.Server(host, port, {auto_reconnect: true}, {}), { safe: true  });
            
            db.open(function (err, result) {
                if (err)
                    cb(err, null)
                else {
                    currentdb = db;
                    currentdbname = dbname;
                    cb(null, result);
                }
            });

            return db;
        }
    },
    closeDatabase: function (db, cb) {
        if (db == currentdb) {
            currentdb = null;
            currentdbname = null;
        }
        db.close(true, cb);
    },
    closeCurrentDatabase: function (cb) {
        if (currentdb == null)
            cb(null, null);
        else
            this.closeDatabase(currentdb, cb);
    },
    getCurrentDatabaseName: function () { return currentdbname; },
    getDatabaseNames: function(cb) {
        currentdb.admin().listDatabases(cb);
    }
};

