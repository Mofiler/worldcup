
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
    cb(null, matches.slice());
};

function clone(obj) {
    var newobj = { };
    
    for (var n in obj)
        newobj[n] = obj[n];
        
    return newobj;
}

module.exports = {
    add: add,
    getList: getList,
    getById: getById
}

