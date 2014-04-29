# World Cup Server

## Setup

Install [Node.js](http://nodejs.org/)

Install and run a local [MongoDB](https://www.mongodb.org/)

Run once
```
npm install
```

## Start

Run
```
node app
```

Optionally, you can use a date, to load matches as not played if their date is greater or equal the specified date
```
node app -d 20140620
```

Initially, the data is loaded in memory from `matches.json`. Partial content:
```
[
    {
        "local": "Brazil",
        "away": "Croatia",
        "localgoals": 2,
        "awaygoals": 1,
        "date": "20140612",
        "time": "2000",
        "stage": "Group A",
        "venue": "Arena Corinthians"
    },
    {
        "local": "Mexico",
        "away": "Cameroon",
        "localgoals": 1,
        "awaygoals": 3,
        "date": "20140613",
        "time": "1600",
        "stage": "Group A",
        "venue": "Estadio das Dunas"
    },
// ...
]
```

## Configuration

You can edit the `config.json` file:
```
{
    "database": "worldcup",
    "mongodb": {
        "host": "localhost",
        "port": 27017
    },
    "stages": [
        "Group A",
        "Group B",
        "Group C",
        "Group D",
        "Group E",
        "Group F",
        "Group G",
        "Group H",
        "Second Round",
        "Quarterfinals",
        "Semifinals",
        "Finals"
    ],
    "feeds": [
        "http://www.tipgin.net/example-data/livescore-feed-example.xml"
    ]
}
```

The database is used at start.
