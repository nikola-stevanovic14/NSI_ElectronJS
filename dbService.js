const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const {provideTournamentModels} = require('./dataLayer/tournament')

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

