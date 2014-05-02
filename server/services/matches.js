
var mongodb = require('../libs/mongodb');
var config = require('../config.json');

function MatchesDb(db) {
    var cache = require('simplekache').create();
    var repository = mongodb.createRepository(db, 'matches');
    
    this.clear = function (cb) {
        cache.set('matches', null);
        repository.clear(cb);
    };

    this.add = function (match, cb) {
        cache.set('matches', null);
        repository.insert(match, function (err, records) {
            if (err) {
                cb(err, null);
                return;
            }
            
            cb(null, records[0]._id.toString());
        });
    };

    this.update = function (id, match, cb) {
        cache.set('matches', null);
        repository.update(id, match, function (err, records) {
            if (err) {
                cb(err, null);
                return;
            }
            
            cb(null, id.toString());
        });
    };

    this.remove = function (id, cb) {
        cache.set('matches', null);
        repository.remove(id, cb);
    };
    
    this.getList = function (options, cb) {
        if (typeof options == 'function' && !cb) {
            cb = options;
            options = null;
        }
        
        options = options || { };
        
        var items = cache.get('matches');
        
        if (items) {
            cb(null, filterItems(result, options));
            return;
        }
            
        repository.findAll(function (err, items) {
            if (err) {
                cb(err, null);
                return;
            }
            
            var result = filterItems(items, options);
            
            cache.set('matches', result, config.cache.lifetime);
            
            cb(null, result);
        });
    };
    
    function filterItems(items, options) {
        var result = [];
        
        items.forEach(function(item) {
            if (options.date) {
                if (item.date != options.date)
                    return;
                if (options.time && item.time && options.time < item.time)
                    return;
            }
            
            if (options.notfinished && item.finished)
                return;
            if (options.finished && !item.finished)
                return;
                
            item.id = item._id.toString();
            result.push(item);
        });
        
        return result;
    }
    
    this.getById = function (id, cb) {
        repository.findById(id, function (err, item) {
            if (err) {
                cb(err, null);
                return;
            }
            
            if (item)
                item.id = item._id.toString();
            
            cb(null, item);
        });
    };
    
    this.findOne = function (criteria, cb) {
        repository.findOne(criteria, cb);
    }

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

    this.update = function (id, match, cb) {
        var item = clone(match);
        item.id = id;
        matches[item.id] = item;
        cb(null, item.id);
    };
    
    this.remove = function (id, cb) {
        delete matches[id];
        cb(null, null);
    }

    this.getById = function (id, cb) {
        cb(null, matches[id]);
    };
    
    this.findOne = function (criteria, cb) {
        for (var n in matches) {
            var match = matches[n];
            
            if (satisfy(match, criteria)) {
                cb(null, clone(match));
                return;
            }
        }
        
        cb(null, null);
    }

    this.getList = function (options, cb) {
        if (typeof options == 'function' && !cb) {
            cb = options;
            options = null;
        }
        
        options = options || { };
        
        var result = [];
        
        matches.forEach(function (match) {
            if (options.date) {
                if (match.date != options.date)
                    return;
                if (options.time && match.time && options.time < match.time)
                    return;
            }
            
            if (options.notfinished && match.finished)
                return;
            if (options.finished && !match.finished)
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

function satisfy(obj, criteria) {
    for (var n in criteria)
        if (obj[n] != criteria[n])
            return false;

    return true;
}

var memoryprovider = new MatchesMemory();
var provider = memoryprovider;

function clear(cb) {
    provider.clear(cb);
}

function add(match, cb) {
    provider.add(match, cb);
}

function update(id, match, cb) {
    provider.update(id, match, cb);
}

function remove(id, cb) {
    provider.remove(id, cb);
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

function findOne(criteria, cb) {
    provider.findOne(criteria, cb);
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
    update: update,
    remove: remove,
    getList: getList,
    addList: addList,
    getById: getById,
    findOne: findOne,
    useDatabase: useDatabase,
    useMemory: useMemory
}

