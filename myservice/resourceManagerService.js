const http = require('http');
const fs = require('fs');
const dbConn = require('../utils/DbConn');
const querystring = require('querystring');

const server = http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'POST' && req.url === '/api/addResource') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            console.log("[api/addResource] Received: ", body);
            const data = JSON.parse(body);
            const resourceObject = {
                name: data.name,
                description: data.description,
                tags: data.tags,
                category: data.category,
                link: data.link,
                language: data.language,
                userId: data.userId
            };
            console.log("[api/addResource] Resource object: ", resourceObject);
            const query = "INSERT INTO resources (name, description, category, url, language, user_id) VALUES (?, ?, ?, ?, ?, ?)";
            const params = [resourceObject.name, resourceObject.description, resourceObject.category, resourceObject.link, resourceObject.language, resourceObject.userId];
            try {
                dbConn.query(query, params, function (err, rows, fields) {
                    if (err) throw err;
                    console.log("[api/addResource] Added resource");
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({added: true}));
                });
            } catch (err) {
                console.log("[api/addResource] Error: ", err);
                res.end(JSON.stringify({added: false}));
            }

        });


    }

    if (req.method === 'POST' && req.url.includes('/api/deleteResource')) {
        let resourceId='';
        req.on('data', (chunk) => {
            resourceId += chunk;
        });
        req.on('end', () => {
            parsedId=JSON.parse(resourceId);
            console.log("[api/deleteResource] Attempting delete...");
            const query = "DELETE FROM resources WHERE id = ?";
            const params = [parsedId.resourceId];
            try {
                dbConn.query(query, params, function (err, rows, fields) {
                    if (err) throw err;
                    console.log("[api/deleteResource] Deleted resource");
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({deleted: true}));
                });
            } catch (err) {
                console.log("[api/deleteResource] Error: ", err);
                res.writehead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({deleted: false}));
            }
        });
    }
});

server.listen(3006, () => console.log('Managerul de resurse ruleaza pe portul 3006'));

function checkResourceId(resourceId){
    let received = false;
    const query = "SELECT * FROM resources WHERE id = ?";
    const params = [resourceId];
        dbConn.query(query, params, function (err, rows, fields) {
            if (err) throw err;
            console.log("[api/deleteResource] Found: ", rows);
            if (rows.length > 0) {
                console.log("[api/deleteResource] Resource exists");
                received = true;
            } else {
                console.log("[api/deleteResource] Resource does not exist");
                received = false;
            }
        });
    return received;
}