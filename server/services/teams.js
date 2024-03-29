
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
        teams[teamname] = { team: teamname, wins: 0, losts: 0, ties: 0, matches: 0, goals: 0, owngoals: 0, secondround: 0, quarterfinals: 0, semifinals: 0, finals: 0 };
        
    var team = teams[teamname];
  
    if (match.hasOwnProperty('localgoals') && match.hasOwnProperty('awaygoals')) {
        if (islocal) {
            if (match.localgoals > match.awaygoals)
                team.wins += 1;
            else if (match.localgoals < match.awaygoals)
                team.losts += 1;
            else
                team.ties += 1;
                
            team.goals += match.localgoals;
            team.owngoals += match.awaygoals;
        }
        else {
            if (match.localgoals > match.awaygoals)
                team.losts += 1;
            else if (match.localgoals < match.awaygoals)
                team.wins += 1;
            else
                team.ties += 1;
                
            team.goals += match.awaygoals;
            team.owngoals += match.localgoals;
        }
        team.matches += 1;

        if (!match.finished)
            if (!team.hasOwnProperty('nextmatch') || team.nextmatch.date > match.date || (team.nextmatch.date == match.date && team.nextmatch.time > match.time))
                team.nextmatch = match;
    }
    else {
        if (!team.hasOwnProperty('nextmatch') || team.nextmatch.date > match.date || (team.nextmatch.date == match.date && team.nextmatch.time > match.time))
            team.nextmatch = match;
    }
    
    var nmatch = match.key || 0;
    
    if (nmatch && match.stage == 'Second Round')
        if (islocal)
            team.secondround = nmatch;
        else
            team.secondround = nmatch + 8;
    
    if (nmatch && match.stage == 'Quarterfinals')
        if (islocal)
            team.quarterfinals = nmatch;
        else
            team.quarterfinals = nmatch + 4;
    
    if (nmatch && match.stage == 'Semifinals')
        if (islocal)
            team.semifinals = nmatch;
        else
            team.semifinals = nmatch + 2;
    
    if (nmatch && match.stage == 'Finals')
        if (islocal)
            team.finals = nmatch;
        else
            team.finals = nmatch + 1;
}

module.exports = {
    getList: getList
};