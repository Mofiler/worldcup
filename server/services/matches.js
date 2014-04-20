
var maxid = 0;
var matches = [];

function add(match, cb) {
    maxid++;
    var item = clone(match);
    item.id = maxid;
    matches[item.id] = item;
    cb(null, item.id);
};

function getById(id, cb) {
    cb(null, matches[id]);
};

function getList(cb) {
    var result = [];
    
    matches.forEach(function (match) {
        result.push(clone(match));
    });
    
    cb(null, result);
};

function addList(list, options, cb) {
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
        
        add(item, function () { setImmediate(function () { doStep(); }) });
    }
};

function clone(obj) {
    var newobj = { };
    
    for (var n in obj)
        newobj[n] = obj[n];
        
    return newobj;
}

function clear(cb) {
    maxid = 0;
    matches = [];
    cb(null, null);
}

module.exports = {
    clear: clear,
    add: add,
    getList: getList,
    addList: addList,
    getById: getById
}

