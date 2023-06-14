const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const lines = data.split('\n');
    const tags = [];
    const resources = [];
    class resource {
        constructor(name, url, description, tags) {
            this.name = name;
            this.url = url;
            this.description = description;
            this.tags = tags;
        }
    }

    let currentTag = '';
    let currentResource = {};

    lines.forEach(line => {
        if (line.startsWith('#')) {
            // Extract the tag from the line
            currentTag = line.substring(line.lastIndexOf('#') + 1).trim();
        } else if (line.startsWith('- [')) {
            // Extract the name, URL, and description from the line
            const nameStartIndex = line.indexOf('[') + 1;
            const nameEndIndex = line.indexOf(']');
            const urlStartIndex = line.indexOf('(') + 1;
            const urlEndIndex = line.indexOf(')');
            const description = line.substring(urlEndIndex + 1).trim();

            const name = line.substring(nameStartIndex, nameEndIndex);
            const url = line.substring(urlStartIndex, urlEndIndex);


               // Create a new resource object
            currentResource = new resource(name, url, description, [currentTag]);
            // Add the resource to the list of resources
            resources.push(currentResource);
            // Add the tag to the list of tags if it doesn't already exist
            if (!tags.includes(currentTag)) {
                tags.push(currentTag);

            }
        }
    });

    console.log('Tags:', tags);
    console.log('Resources:', resources);
});
