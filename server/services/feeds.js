
var http = require('http'),
    url = require('url'),
    matches = require('./matches'),
    zlib = require('zlib'),
    config = require('../config.json'),
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

function tryapply(score, cb) {
    try {
        apply(score, cb);
    }
    catch (ex) {
        console.log(ex);
    }
}

function apply(score, cb) {
    var visited = 0;
    var processed = 0;
    
    if (!score || !score.livescore || !score.livescore.league)
        return;
    
    score.livescore.league.forEach(function (league) {
        if (!league || !league.match)
            return;
            
        league.match.forEach(function (mtch) {
            var local = mtch.home[0].$.name;
            if (local)
                local = normalizeName(local);
            var localgoals = getInteger(mtch.home[0].$.goals);
            
            var away = mtch.away[0].$.name;            
            if (away)
                away = normalizeName(away);
                
            var awaygoals = getInteger(mtch.away[0].$.goals);
            
            var date = getDate(mtch.$.date);
            
            var finished = mtch.$.status == 'FT';
            
            if (localgoals == null || awaygoals == null)
                return;
                
            visited++;
                
            setImmediate(function () {
                matches.findOne({ local: local, away: away, date: date }, function (err, data) {
                    if (err) {
                        cb(err, null);
                        return;
                    }
                        
                    if (!data) {
                        processed++;
                        if (processed == visited)
                            cb(null, processed);
                            
                        return;
                    }
                    
                    data.localgoals = localgoals;
                    data.awaygoals = awaygoals;
                    
                    if (finished)
                        data.finished = true;
                    
                    var id = data.id;
                    
                    if (data._id) {
                        id = data._id.toString();
                        delete data._id;
                    }
                    
                    matches.update(id, data, function (err, result) {
                        if (err) {
                            cb(err, null);
                            return;
                        }
                        
                        processed++;
                        
                        if (processed == visited)
                            cb(null, processed);
                    });
                });
            });
        });
    });
}

function normalizeName(name) {
    if (config.translate && config.translate[name])
        name = config.translate[name];
        
    name = name.replace(/\s/g,'');
    return name;
}

function getInteger(text) {
    if (text == null)
        return null;
        
    var value = parseInt(text);
    
    if (value.toString() != text.trim())
        return null;
        
    return value;
}

function getDate(text) {
    return text.substring(6, 10) + text.substring(3, 5) + text.substring(0, 2);
}

module.exports = {
    read: read,
    apply: tryapply
};

