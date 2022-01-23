const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const {provideTournamentModels} = require('./dataLayer/tournament')
const {provideTitleModels} = require('./dataLayer/title')
const {provideRankingModels} = require('./dataLayer/rankings')
const {providePlayerModel} = require('./dataLayer/player')

let pool

exports.initConnectionPool = () => {
    pool = mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'nsi',
        debug    :  false
    })
}

exports.getTestData = async () => {
    return await new Promise(function(resolve, reject){
        pool.query("SELECT * FROM test",(err, data) => {
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}

exports.register= async(user)=>{
    return await new Promise (function(resolve, reject){
        const values=[[
            user.username,
            user.passwordHash
        ]]
        pool.query('INSERT INTO user (Username  , PasswordHash) VALUES (?)',values,(err,data)=>{
            if(err)
            {
                reject(err);
            }
            resolve(data);
        })
    });
}

exports.login = async(user) => {
    return await new Promise (function(resolve, reject) {
        let sqlText = "SELECT * FROM user WHERE Username = '" + user.username + "'";
        pool.query(sqlText ,(err, data) => {
            if(err){
                reject(err)
            }
            if(data && data.length > 0){
                const userDb = data[0]
                const success = bcrypt.compareSync(user.password, userDb.PasswordHash);
                if(success){
                    resolve(userDb)
                }
                resolve(null)
            }
            resolve(null)
        })
    })
}

exports.getTournamentTypes = async() => {
    return await new Promise (function(resolve, reject) {
        let sqlText = `SELECT * FROM pairingsystems`;
        pool.query(sqlText, (err, data) => {
            if (err){
                reject(err);
            }
            resolve(data);
        })
    });
}

exports.addNewTournament = async(tournamentData) => {
    return await new Promise (function(resolve, reject) {
        let sqlText = `
        INSERT INTO tournaments
        (PairingSystem, NumberOfRounds, Name, CreatedDate, StartDate, EndDate, Open, Closed, Finished, Tempo, MaxNumberOfPlayers, NumberOfPlayers)
        VALUES(${tournamentData.PairingSystem}, ${tournamentData.NumberOfRounds}, '${tournamentData.Name}', '${tournamentData.CreatedDate}',
            '${tournamentData.StartDate}', '${tournamentData.EndDate}', ${tournamentData.Open}, ${tournamentData.Closed},
            ${tournamentData.Finished}, ${tournamentData.Tempo}, ${tournamentData.MaxNumberOfPlayers}, ${tournamentData.NumberOfPlayers});`;

        pool.query(sqlText, (err, data) => {
            if (err){
                reject(err);
            }
            resolve(data);
        })
    });
}
/// TOURNAMENTS

exports.getTournaments = async () => {
    return await new Promise(function(resolve, reject){
        pool.query("SELECT * FROM tournaments",(err, data) => {
            if(err){
                reject(err)
            }
            resolve(provideTournamentModels(data))
        })
    })
}


/// RANKINGS

exports.getRankings = async (tournamentId) => {
    return await new Promise(function(resolve, reject){
        let sqlText = `
        SELECT P.FirstName AS player, T.Name AS tournament, R.StartingPosition AS startingPosition, R.StartingElo AS startingElo,
            TITLE.Title AS startingTitle, R.Points AS points, R.MedianBucholz AS medianBucholz, R.Bucholz AS bucholz, R.Wins AS wins,
            R.BlackWins AS blackWins, R.SonnebornBerger AS sonnebornBerger, R.EloPerformance AS eloPerformance, R.Luck AS luck
        FROM nsi.tournaments AS T
        INNER JOIN nsi.tournamentplayerrankings AS R ON T.Id = R.TournamentId
        INNER JOIN nsi.players AS P ON P.Id = R.PlayerId
        INNER JOIN nsi.titles AS TITLE ON TITLE.Id = R.StartingTitle
        WHERE T.Id = ` + tournamentId +`
        ORDER BY R.Points DESC, R.MedianBucholz DESC, R.Bucholz DESC, R.EloPerformance DESC, R.SonnebornBerger DESC, R.Wins DESC, 
            R.BlackWins DESC, R.Luck DESC, P.EloRating DESC, TITLE.Prestige DESC`;
        pool.query(sqlText,(err, data) => {
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}

exports.getRankingsModels = async (tournamentId) => {
    return await new Promise(function(resolve, reject){
        pool.query("SELECT * FROM tournamentplayerrankings WHERE TournamentId = "+tournamentId,(err, data) => {
            if(err){
                reject(err)
            }
            resolve(provideRankingModels(data))
        })
    })
}

/// PLAYER

exports.getPlayerById = async (playerId) => {
    return await new Promise(function(resolve, reject){
        pool.query("SELECT * FROM players WHERE Id = "+playerId,(err, data) => {
            if(err){
                reject(err)
            }
            const players = providePlayerModel(data)
            resolve(players && players.length > 0 ? players[0] : null)
        })
    })
}


///TITLES

exports.getTitleById = async (titleId) => {
    return await new Promise(function(resolve, reject){
        pool.query("SELECT * FROM titles WHERE Id = "+titleId,(err, data) => {
            if(err){
                reject(err)
            }
            const titles = provideTitleModels(data)
            resolve(titles && titles.length > 0 ? titles[0] : null)
        })
    })
}
