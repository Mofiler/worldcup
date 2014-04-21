
var mongodb = require('../libs/mongodb');

function MatchesDb(db) {
    var repository = mongodb.createRepository(db, 'matches');
    
    this.clear = function (cb) {
        repository.clear(cb);
    };

    this.add = function (match, cb) {
        repository.insert(match, function (err, records) {
            if (err) {
                cb(err, null);
                return;
            }
            
            cb(null, records[0]._id.toString());
        });
    };
    
    this.getList = function (options, cb) {
        if (typeof options == 'function' && !cb) {
            cb = options;
            options = null;
        }
        
        options = options || { };
        
        repository.findAll(function (err, items) {
            if (err) {
                cb(err, null);
                return;
            }
            
            var result = [];
            
            items.forEach(function(item) {
                if (options.date && item.date != options.date)
                    return;
                    
                item.id = item._id.toString();
                result.push(item);
            });
            
            cb(null, result);
        });
    };
    
    this.getById = function (id, cb) {
        repository.findById(id, function (err, item) {
            if (err) {
                cb(err, null);
                return;
            }
            
            item.id = item._id.toString();
            
            cb(null, item);
        });
    };

    this.addList = function (list, options, cb) {
        var self = this;
        
        if (options && !cb && typeof options == 'function') {
            cb = options;
            options = null;
        }
        
        options = options || { };
        
        var k = 0;
        var l = list.length;
        
        doStep();
        
        function doStep() {
            if (k >= l) {
                cb(null, null);
                return;
            }
            
            var item = clone(list[k++]);
            
            if (item.date && options.date && item.date > options.date) {
                delete item.localgoals;
                delete item.awaygoals;
            }
            else if (item.date && options.date && item.date == options.date && (!options.time || item.time >= options.time)) {
                delete item.localgoals;
                delete item.awaygoals;
            }
            
            self.add(item, function () { setImmediate(function () { doStep(); }) });
        }
    };
};

function MatchesMemory() {
    var maxid = 0;
    var matches = [];

    this.add = function (match, cb) {
        maxid++;
        var item = clone(match);
        item.id = maxid;
        matches[item.id] = item;
        cb(null, item.id);
    };

    this.getById = function (id, cb) {
        cb(null, matches[id]);
    };

    this.getList = function (options, cb) {
        if (typeof options == 'function' && !cb) {
            cb = options;
            options = null;
        }
        
        options = options || { };
        
        var result = [];
        
        matches.forEach(function (match) {
            if (options.date && match.date != options.date)
                return;
                
            result.push(clone(match));
        });
        
        cb(null, result);
    };

    this.addList = function (list, options, cb) {
        var self = this;
        
        if (options && !cb && typeof options == 'function') {
            cb = options;
            options = null;
        }
        
        options = options || { };
        
        var k = 0;
        var l = list.length;
        
        doStep();
        
        function doStep() {
            if (k >= l) {
                cb(null, null);
                return;
            }
            
            var item = clone(list[k++]);
            
            if (item.date && options.date && item.date > options.date) {
                delete item.localgoals;
                delete item.awaygoals;
            }
            else if (item.date && options.date && item.date == options.date && (!options.time || item.time >= options.time)) {
                delete item.localgoals;
                delete item.awaygoals;
            }
            
            self.add(item, function () { setImmediate(function () { doStep(); }) });
        }
    };

    this.clear = function (cb) {
        maxid = 0;
        matches = [];
        cb(null, null);
    }
}

function clone(obj) {
    var newobj = { };
    
    for (var n in obj)
        newobj[n] = obj[n];
        
    return newobj;
}

var memoryprovider = new MatchesMemory();
var provider = memoryprovider;

function clear(cb) {
    provider.clear(cb);
}

function add(match, cb) {
    provider.add(match, cb);
}

function getList(options, cb) {
    provider.getList(options, cb);
}

function addList(list, options, cb) {
    provider.addList(list, options, cb);
}

function getById(id, cb) {
    provider.getById(id, cb);
}

function useDatabase(db) {
    provider = new MatchesDb(db);
}

function useMemory() {
    provider = memoryprovider;
}

module.exports = {
    clear: clear,
    add: add,
    getList: getList,
    addList: addList,
    getById: getById,
    useDatabase: useDatabase,
    useMemory: useMemory
}

