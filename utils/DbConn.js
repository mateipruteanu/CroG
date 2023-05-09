const mysql = require('mysql');
let connection = mysql.createConnection({
    host: "34.116.255.231",
    port: "3306",
    database: "root",
    user: "root",
    password: "k9RL^9p#2RHC^u",
});
function connect(){
    connection.connect(function(err) {
        if (err){
            console.log('Error connecting to Db' + err.stack);
            return;
        };
    
        console.log('Connected as id' + connection.threadId);
    });
}

connection.connect(function(err) {
    if (err){
        console.log('Error connecting to Db' + err.stack);
        return;
    };

    console.log('Connected as id' + connection.threadId);
});

connection.query('SHOW TABLES', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows);
});

module.exports = connection;