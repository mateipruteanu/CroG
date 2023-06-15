const http = require('http');
const dbConn = require('../utils/DbConn');

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    if (req.method === 'GET' && req.url === '/api/getResources') {
        const query = "SELECT * FROM resources";
        dbConn.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: "Internal server error"}));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(result));
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});

    }
});
server.listen(3007, () => console.log('Serviciul get ruleaza pe portul 3007'));