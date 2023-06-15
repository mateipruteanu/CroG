const http = require('http');
const crypto = require('crypto');
const dbConn = require('../utils/DbConn');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);


    if (req.method === 'POST' && req.url === '/api/login') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            if (body === '') {
                res.writeHead(400);
                res.end('[authAPI/login] No parameters sent]');
                return;
            }
            const data = JSON.parse(body);
            const username = data.username;
            const password = data.password;


            dbConn.query(
                "SELECT * FROM users WHERE username = ? AND password = ?", [username, password],
                function (err, rows, fields) {
                    if (err) throw err;
                    console.log("[authAPI/login] Found: ", rows);
                    if (rows.length > 0) {
                        console.log("[authAPI/login] Login successful");

                        const sessionId = crypto.randomUUID();
                        console.log("[authAPI/login] Session ID: ", sessionId);

                        const query = "UPDATE users SET session_id = ? WHERE username = ?";
                        const params = [sessionId, username];
                        dbConn.query(query, params, function (err, rows, fields) {
                            if (err) throw err;
                            console.log("[authAPI/login] Updated session ID");
                        });

                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({authenticated: true, sessionId: sessionId}));

                    } else {
                        console.log("[authAPI/login] Login failed");
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({authenticated: false}));
                    }
                    res.end();
                }
            );
        });
    } else if (req.method === 'POST' && req.url === '/api/signup') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            if (body === '') {
                res.writeHead(400);
                res.end('[authAPI/signUp] No parameters sent');
                return;
            }
            const data = JSON.parse(body);
            const username = data.username;
            const password = data.password;
            const email = data.email;
            console.log("[authAPI/signUp] Username: " + username + " Password: " + password + " Email: " + email)
            const query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
            const params = [username, password, email];
            dbConn.query(query, params, function (err, rows, fields) {
                if (err) throw err;
                console.log("[authAPI/signUp] Inserted new user " + username + " into database");
            });
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({registered: true}));
        });

    } else if (req.method === 'GET' && req.url.includes('/api/getUserBySessionId')) {
        let sessionId = req.url.split('?')[1].split('=')[1].trim();
        if (sessionId !== undefined && sessionId !== null && sessionId !== '') {
            console.log("[authAPI/getUserBySessionId] Session ID: " + sessionId);
            const query = "SELECT id,username, email FROM users WHERE session_id = ?";
            const params = [sessionId];
            dbConn.query(query, params, function (err, rows, fields) {
                if (err) throw err;
                // console.log("[authAPI/getUserBySessionId] Found: ", rows);
                if (rows.length > 0) {
                    console.log("[authAPI/getUserBySessionId] Found user with session ID " + sessionId);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({user: rows[0]}));
                } else {
                    console.log("[authAPI/getUserBySessionId] No user with session ID " + sessionId + " found");
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({user: null}));
                }
            });
        } else {
            res.writeHead(400);
            res.end('[authAPI] No session ID provided');
        }
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(3005, () => {
    console.log('Microserviciul de autentificare a pornit pe portul 3005');
});