
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

function addList(list, cb) {
    var k = 0;
    var l = list.length;
    
    doStep();
    
    function doStep() {
        if (k >= l) {
            cb(null, null);
            return;
        }
        
        var item = list[k++];
        
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

