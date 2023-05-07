var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'test',
    user: 'root',
    password: 'root'
});

connection.connect(function(err) {
    if (err){
        console.log('Error connecting to Db' + err.stack);
        return;
    };

    console.log('Connected as id' + connection.threadId);
});
