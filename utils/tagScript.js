const fs = require('fs');
const dbConn = require('../utils/DbConn');

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
    let tags = [];
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
            if (!tags.includes(currentTag)) {
                tags.push(currentTag);
            }

        }

    });

    resources.forEach(resource => {
        const query = "SELECT id FROM tags WHERE name = ?";
        const params = [resource.tag];

        dbConn.query(query, params, function (err, rows, fields) {
            if (err) throw err;
            if (rows.length > 0) {
                let tagId = rows[0].id;
                console.log("Tag name: " + resource.tag + " Tag id: ", tagId);

                const query2 = "SELECT id FROM resources WHERE name = ?";
                const params2 = [resource.name];

                dbConn.query(query2, params2, function (err, rows, fields) {
                    if (err) throw err;
                    if (rows.length > 0) {
                        let resourceId = rows[0].id;
                        console.log("Resource name: " + resource.name + " Resource id: ", resourceId);

                        const query3 = "INSERT INTO resource_tag (resource_id, tag_id) VALUES (?, ?)";
                        const params3 = [resourceId, tagId];

                        dbConn.query(query3, params3, function (err, rows, fields) {
                            if (err) throw err;
                            console.log("Inserted resource_tag");
                        });
                    }

                });
            }
        });
    });
});
