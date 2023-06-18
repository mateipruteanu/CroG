const http = require('http');
const fs = require('fs');
const dbConn = require('../utils/databaseConnection');
const querystring = require('querystring');
const queryDictionaryJson = fs.readFileSync('./utils/queryDictionary.json');
const queryDictionary = JSON.parse(queryDictionaryJson.toString());

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
            const queryResources = "INSERT INTO resources (name, description, category, url, language, user_id) VALUES (?, ?, ?, ?, ?, ?)";
            const resourcesParams = [resourceObject.name, resourceObject.description, resourceObject.category, resourceObject.link, resourceObject.language, resourceObject.userId];

            const queryTags = "INSERT INTO tags (tag_name) VALUES (?)";
            const tagsParams = [resourceObject.tags]; // string

            const queryResourceTag = "INSERT INTO resource_tag (resource_id, tag_id) VALUES (?, ?)";
            const resourceTagParams = [1, 1];


            try {
                dbConn.query(queryResources, resourcesParams, function (err, rows, fields) {
                    if (err) throw err;
                    console.log("[api/addResource] Added resource with id: ", rows.insertId);
                    resourceTagParams[0] = rows.insertId;

                    dbConn.query(queryTags, tagsParams, function (err, rows, fields) {
                        if (err) throw err;
                        console.log("[api/addResource] Added tag with id: ", rows.insertId);
                        resourceTagParams[1] = rows.insertId;
                        console.log("[api/addResource] resourceTagParams: ", resourceTagParams)

                        dbConn.query(queryResourceTag, resourceTagParams, function (err, rows, fields) {
                            if (err) throw err;
                            // add the name of the resource to the queryDictionary
                            queryDictionary.words.push(resourceObject.name);
                            fs.writeFileSync('./utils/queryDictionary.json', JSON.stringify(queryDictionary));
                            console.log("[api/addResource] Added resource_tag with id: ", rows.insertId);
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({added: true}));
                        });
                    });
                });

            } catch (err) {
                console.log("[api/addResource] Error: ", err);
                res.end(JSON.stringify({added: false}));
            }

        });


    }

    if (req.method === 'POST' && req.url.includes('/api/deleteResource')) {
        let resourceId = '';
        req.on('data', (chunk) => {
            resourceId += chunk;
        });
        req.on('end', () => {
            parsedId = JSON.parse(resourceId);
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

server.listen(3006, () => console.log('Resource manager microservice running at http://localhost:3006/'));
