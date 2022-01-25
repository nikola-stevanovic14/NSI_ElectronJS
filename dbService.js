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
            R.BlackWins DESC, R.Luck DESC, P.EloRating DESC, TITLE.Prestige DESC `;
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

exports.getPlayers = async () => {
    return await new Promise(function(resolve, reject){
        pool.query(`
            SELECT A.*, B.Title AS TitleName, B.Id AS Title 
            FROM players AS A 
            INNER JOIN titles AS B ON B.Id = A.Title 
            ORDER BY A.Id `, (err, data) => {
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}

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

/// ROUNDS

exports.getRound = async (tournamentId, roundNumber) => {
    return await new Promise(function(resolve, reject){
        let sqlText = `
        SELECT WHITE.FirstName AS WhiteFirstName, WHITE.LastName AS WhiteLastName, BLACK.FirstName AS BlackFirstName, BLACK.LastName AS BlackLastName,  
            R.Id AS Id, WHITE.Id AS  WhiteId, BLACK.Id AS BlackId, R.Tournament AS TournamentId , T.NumberOfRounds AS NumberOfRounds 
        FROM rounds AS R 
        INNER JOIN tournaments AS T ON T.Id = R.Tournament 
        INNER JOIN players AS WHITE ON R.WhitePlayer = WHITE.Id 
        INNER JOIN players AS BLACK ON R.BlackPlayer = BLACK.Id 
        WHERE R.Tournament = ${tournamentId} AND R.RoundNumber = ${roundNumber} `;

        pool.query(sqlText,(err, data) => {
            if(err){
                reject(err)
            }
            roundResult = {};
            roundResult.roundNumber = roundNumber;
            roundResult.matches = data;
            resolve(data);
        })
    })
}

exports.addRound = async (matches, roundNumber, tournamentId) => {
    return await new Promise(function(resolve, reject){
        let sqlText = '';
        matches.forEach(match => {
            singleInsert = `
            INSERT INTO rounds (RoundNumber, WhitePlayer, BlackPlayer, Tournament, WhitePoints, BlackPoints, Started, Finished, WhiteTitle, BlackTitle, Result) 
            VALUES (${roundNumber}, ${match.whiteId}, ${match.blackId}, ${tournamentId},  
                ${match.whitePoints != null ? match.whitePoints : 'NULL'}, ${match.blackPoints != null ? match.blackPoints : 'NULL'}, 
                0, 0, ${match.whiteTitle}, ${match.blackTitle}, NULL); `;
            sqlText += singleInsert;
        });

        pool.query(sqlText,(err, data) => {
            if(err){
                reject(err)
            }
            resolve(data);
        })
    })
}

exports.startBergerTournament = async (rounds, tournamentId, players) => {
    return await new Promise(function(resolve, reject){
        let sqlText = ``;
        players.forEach(player => {
            let playerInsert = `INSERT INTO tournamentplayerrankings (PlayerId, TournamentId, StartingElo, StartingTitle) VALUES(${player.Id}, ${tournamentId}, ${player.EloRating}, ${player.Title});`;
            sqlText += playerInsert;
        })
        rounds.forEach(round => {
            round.matches.forEach(match => {
                let singleInsert = `INSERT INTO rounds (RoundNumber, WhitePlayer, BlackPlayer, Tournament, WhitePoints, BlackPoints, Started, Finished, WhiteTitle, BlackTitle, Result) VALUES (${round.roundNumber}, ${match.whiteId}, ${match.blackId}, ${tournamentId}, ${match.whitePoints != null ? match.whitePoints : 'NULL'}, ${match.blackPoints != null ? match.blackPoints : 'NULL'}, 0, 0, ${match.whiteTitle}, ${match.blackTitle}, NULL); `;
                sqlText += singleInsert;
            });
        });
        sqlText += `UPDATE tournaments SET Open = 0, Closed = 1 WHERE Id = ${tournamentId} ;`;

        var connection = mysql.createConnection(
            {
                multipleStatements: true,
                host     : 'localhost',
                user     : 'root',
                password : 'root',
                database : 'nsi',
                debug    :  false
            });

        connection.connect(function(err) {
            if (err) reject(err);
            connection.query(sqlText, function (err, result, fields) {
                if (err) 
                    reject(err);
                resolve(result);
            });
          });


        // pool.query(sqlText,(err, data) => {
        //     if(err){
        //         reject(err)
        //     }
        //     resolve(data);
        // })
    })
}

exports.finishBergerRound = async (results, tournamentId, isLast) => {
    return await new Promise(function(resolve, reject){
        let sqlText = ``;
        /*
        let sqlUpdateSonneborn = `
        UPDATE tournamentplayerrankings AS TR
        INNER JOIN 
            (SELECT
            FROM rounds AS R
            WHERE R.Tournament = ${tournamentId}
            GROU BY )`;*/
        results.forEach(result => {
            let singleResultSql = `
            UPDATE rounds AS R
            SET 
                WhitePoints = ${result.WhitePoints}, 
                BlackPoints = ${result.BlackPoints} 
            WHERE R.Id = ${result.Id}; 
            
            UPDATE tournamentplayerrankings AS TR 
            SET 
                Points = Points + ${result.WhitePoints} 
            WHERE TR.TournamentId = ${tournamentId} AND TR.PlayerId = ${result.WhiteId}; 
            
            UPDATE tournamentplayerrankings AS TR 
            SET 
                Points = Points + ${result.BlackPoints} 
            WHERE TR.TournamentId = ${tournamentId} AND TR.PlayerId = ${result.BlackId}; `;
            
            sqlText += singleResultSql;
        });

        var connection = mysql.createConnection(
            {
                multipleStatements: true,
                host     : 'localhost',
                user     : 'root',
                password : 'root',
                database : 'nsi',
                debug    :  false
            });

        connection.connect(function(err) {
            if (err) reject(err);
            connection.query(sqlText, function (err, result, fields) {
                if (err) 
                    reject(err);
                resolve(result);
            });
        });

        
        // pool.query(sqlText,(err, data) => {
        //     if(err){
        //         reject(err)
        //     }

        //     if (!isLast){
        //         resolve(data);
        //     }
        //     else{
                
        //         // let updatePlayerDataSql = `
        //         // UPDATE tournamentplayer`;
        //         resolve(data);
        //     }
        // })
    })
}