const mysql = require('mysql');

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



