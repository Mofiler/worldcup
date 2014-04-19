
var matches = require('./matches');

function getList(cb) {
    var teams = { };
    
    matches.getList(function (err, list) {
        if (err) {
            cb(err, null);
            return;
        }
        
        list.forEach(function (match) {
            processMatch(teams, match);
        });
        
        var names = Object.keys(teams);
        names.sort();
        
        var result = [];

        names.forEach(function (name) {
            result.push(teams[name]);
        });
        
        cb(null, result);
    });
}

function processMatch(teams, match) {
    processMatchTeam(teams, match.local, match, true);
    processMatchTeam(teams, match.away, match, false);
}

function processMatchTeam(teams, teamname, match, islocal) {
    if (!teams[teamname])
        teams[teamname] = { team: teamname, wins: 0, losts: 0, ties: 0, matches: 0, goals: 0 };
        
    var team = teams[teamname];
    
    if (islocal) {
        if (match.localgoals > match.awaygoals)
            team.wins += 1;
        else if (match.localgoals < match.awaygoals)
            team.losts += 1;
        else
            team.ties += 1;
            
        team.goals += match.localgoals;
    }
    else {
        if (match.localgoals > match.awaygoals)
            team.losts += 1;
        else if (match.localgoals < match.awaygoals)
            team.wins += 1;
        else
            team.ties += 1;
            
        team.goals += match.awaygoals;
    }
    
    team.matches += 1;
}

module.exports = {
    getList: getList
};