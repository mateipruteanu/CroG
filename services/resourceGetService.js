const http = require('http');
const dbConn = require('../utils/databaseConnection');
const fs = require("fs");
const queryDictionaryJson = fs.readFileSync('./utils/queryDictionary.json');
const queryDictionary = JSON.parse(queryDictionaryJson.toString());

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    if (req.method === 'GET' && req.url === '/api/getResources') {
        const query = "SELECT * FROM resources JOIN resource_tag ON resources.id = resource_tag.resource_id JOIN tags ON resource_tag.tag_id = tags.id";
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
    } else if (req.method === 'POST' && req.url === '/api/getResourcesByNameOrTagsOrDescription') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const queryString = JSON.parse(body).query;
            const searchQueryArray = queryString.split(" ");
            let importantWordsArray = [];
            for (let word of searchQueryArray) {
                if (queryDictionary.words.includes(word)) {
                    importantWordsArray.push(word);
                }
            }
            if (importantWordsArray.length === 0) {
                importantWordsArray = [" "];
            }
            console.log("[resourceGetService/getResourcesByNameOrTagsOrDescription] importantWordsArray: " + importantWordsArray)

            const queryArray = [];
            for (let word of importantWordsArray) {
                queryArray.push(`resources.name LIKE '%${word}%'`);
                queryArray.push(`resources.description LIKE '%${word}%'`);
                queryArray.push(`tags.tag_name LIKE '%${word}%'`);
            }
            const query = `SELECT *
                           FROM resources
                                    JOIN resource_tag ON resources.id = resource_tag.resource_id
                                    JOIN tags ON resource_tag.tag_id = tags.id
                           WHERE ${queryArray.join(" OR ")}`;
            console.log("[resourceGetService/getResourcesByNameOrTagsOrDescription] query: " + query);

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
        });


    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
    }
});
server.listen(3007, () => console.log('Resource getter microservice running at http://localhost:3007/'));
