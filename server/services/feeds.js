
var http = require('http'),
    url = require('url'),
    zlib = require('zlib'),
    xml2js = require('xml2js');

function read(feedurl, cb) {
    var urldata = url.parse(feedurl);
    
    var options = {
        host: urldata.hostname,
        port: urldata.port,
        path: urldata.path,
        headers: { "Accept-Encoding": "identity" },
        method: 'GET'
    };
    
    var parser = new xml2js.Parser();
    
    var req = http.request(options, function(res) {
        var buffer = '';

        var res2 = zlib.createGunzip();
        res.pipe(res2);
        
        res2.on('data', function(d) {
            var text = d.toString();
            buffer += text;
        });

        res2.on('err', function(err) {
            cb(err);
        });

        res2.on('end', function(d) {
            if (d) {
                var text = d.toString();
                buffer += text;
            }

            parser.parseString(buffer, function (err, data) { cb(err, data) });
        });
    });

    req.end();    
}

module.exports = {
    read: read
};