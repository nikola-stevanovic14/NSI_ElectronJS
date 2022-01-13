const mysql = require('mysql2');

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
        let sqlText = "SELECT * FROM user WHERE Username = " + user.username + "AND PasswordHash = " + user.passwordHash;
        pool.query(sqlText ,(err, data) => {
            if(err){
                reject(err)
            }
            resolve(data[0])
        })
    })
}



