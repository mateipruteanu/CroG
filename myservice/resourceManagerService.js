const http = require('http');
const fs = require('fs');
const dbConn = require('../utils/DbConn');
const querystring = require('querystring');


const server = http.createServer((req, res) => {
    if(req.method === 'POST' && req.url === '/api/addResource') {
        if (req.headers['content-type'].startsWith('multipart/form-data')) {
            const boundary = extractBoundary(req.headers['content-type']);


            let buffer = Buffer.alloc(0);

            req.on('data', chunk => {
                buffer = Buffer.concat([buffer, chunk]);
            });

            req.on('end', () => {
                    let formDataObject = {
                        name : '',
                        description : '',
                        category : '',
                        language : '',
                        url : '',
                        //picture : '',
                        user_id : ''
                    };

                    const parts = parseMultipartForm(buffer, boundary);


                    parts.forEach(part => {
                        // if (part.name === 'picture') {
                        //     // @TODO - adding the image to the DB (not working yet)
                        //     const fileName = "fisier.txt";
                        //     const filePath = `${fileName}`;
                        //
                        //
                        //     const blob = new Blob([part.data], { type: "image/jpeg" });
                        //     const blobUrl = URL.createObjectURL(blob);
                        //     console.log("blob " + blob);
                        //
                        //
                        //     formDataObject.picture = blob;
                        //

                        // } else {
                            formDataObject[part.name] = part.data.toString();

                            console.log(part.name, part.data.toString());
                        // }
                    });


                    console.log(JSON.stringify(formDataObject));

                    const query = "INSERT INTO resources (category, description, language, name,  url, user_id) VALUES (?, ?, ?, ?, ?, ?)";
                    const values = [formDataObject.category, formDataObject.description, formDataObject.language, formDataObject.name, formDataObject.url, formDataObject.user_id];

                    dbConn.query(query, values, function (err, result) {
                        if(err)
                            throw err;
                        console.log("Added:", result.affectedRows);
                        if (result.affectedRows > 0) {
                            console.log("Added successfully");
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ added: true }));
                        }
                        else {
                            console.log("Adding failed");
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ added: false }));
                        }
                    });


            });
        }
    } else {
        res.writeHead(404);
        res.end('Pagina nu a fost găsită');
    }
});

server.listen(3006, () => {
    console.log('Managerul de resurse a pornit pe portul 3006');
});


function extractBoundary(contentType) {
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    return boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]) : '';
}


function parseMultipartForm(buffer, boundary) {
    const parts = buffer.toString().split(`--${boundary}`).slice(1, -1);

    return parts.map(part => {
        const headerEnd = part.indexOf('\r\n\r\n');
        const headers = part.slice(0, headerEnd).toString();
        const data = part.slice(headerEnd + 4, -2);

        const nameMatch = headers.match(/name="([^"]+)"/i);
        const filenameMatch = headers.match(/filename="([^"]+)"/i);

        const name = nameMatch ? nameMatch[1] : '';
        const filename = filenameMatch ? filenameMatch[1] : '';

        return {
            name,
            filename,
            data,
        };
    });
}