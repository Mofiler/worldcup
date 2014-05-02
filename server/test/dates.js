
var dates = require('../libs/dates');

exports['Get date'] = function (test) {
    var date = new Date(2014, 1, 1);
    
    var result = dates.getUTCDate(date);
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 8);
    test.equal(result.substring(0, 4), "2014");
    test.equal(result.substring(4, 6), "01");
}

exports['Get time'] = function (test) {
    var date = new Date(2014, 1, 1, 2, 3);
    
    var result = dates.getUTCTime(date);
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 4);
    test.equal(result.substring(0, 1), "0");
    test.equal(result.substring(2), "03");
}