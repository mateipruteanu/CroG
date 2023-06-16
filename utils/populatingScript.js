const fs = require('fs');
const dbConn = require('./databaseConnection');

fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const lines = data.split('\n');
    const resources = [];

    class resource {
        constructor(name, url, description, tag, userId) {
            this.name = name;
            this.url = url;
            this.description = description;
            this.tag = tag;
            this.userId = userId;
        }
    }

    let currentTag = '';
    let currentResource = {};

    lines.forEach(line => {
        if (line.startsWith('#')) {
            currentTag = line.substring(line.lastIndexOf('#') + 1).trim();
        } else if (line.startsWith('- [')) {
            const nameStartIndex = line.indexOf('[') + 1;
            const nameEndIndex = line.indexOf(']');
            const urlStartIndex = line.indexOf('(') + 1;
            const urlEndIndex = line.indexOf(')');
            const description = line.substring(urlEndIndex + 1).trim();

            const name = line.substring(nameStartIndex, nameEndIndex);
            const url = line.substring(urlStartIndex, urlEndIndex);


            currentResource = new resource(name, url, description, currentTag, 0);
            resources.push(currentResource);

        }

    });

    resources.forEach(resource => {
        const query = "INSERT INTO resources (name, description, url,  user_id) VALUES ( ?, ?, ?, ?)";
        const params = [resource.name, resource.description, resource.url, 1];
        try {
            dbConn.query(query, params, function (err, rows, fields) {
                if (err) throw err;
                console.log("[api/addResource] Added resource");
            });
        } catch (err) {
            console.log("[api/addResource] Error: ", err);
        }
    });

    console.log('resources:', resources);
});
