
const mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'database-1.cl4lhu896l24.eu-north-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'crogcrog',
});

connection.connect(function(err) {
    if (err){
        console.log('Error connecting to Db' + err.stack);
        return;
    };

    console.log('Connected as id' + connection.threadId);
});
