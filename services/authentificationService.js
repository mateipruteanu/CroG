const http = require('http');
const crypto = require('crypto');
const dbConn = require('../utils/databaseConnection');

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
            const saltedPassword = data.password + username;

            const hashedPassword = crypto.createHash('sha256').update(saltedPassword).digest('hex');
            console.log("[authAPI/login] Username: " + username + " Password: " + saltedPassword + " hashedPassword: " + hashedPassword);


            dbConn.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, hashedPassword], function (err, rows, fields) {
                if (err) throw err;
                console.log("[authAPI/login] Found: ", rows);
                if (rows.length > 0) {
                    console.log("[authAPI/login] Login successful");

                    // generating the session ID
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
            });
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
            const saltedPassword = data.password + username;
            const email = data.email;

            const hashedPassword = crypto.createHash('sha256').update(saltedPassword).digest('hex');
            console.log("[authAPI/signUp] Username: " + username + " Password: " + saltedPassword + " hashedPassword: " + hashedPassword);

            const query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
            const params = [username, hashedPassword, email];
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
    } else if (req.method === 'GET' && req.url.includes('/api/existsUserWithUsernameOrEmail')) {
        console.log("[authAPI/existsUserWithUsernameOrEmail] Request: " + req.url)
        console.log("[authAPI/existsUserWithUsernameOrEmail] Request1: " + req.url.split('?')[1].split('=')[2].trim());
        let username = req.url.split('?')[1].split('=')[1].split('&')[0].trim();
        let email = req.url.split('?')[1].split('=')[2].trim();
        if (username !== "" || email !== "") {
            console.log("[authAPI/existsUserWithUsernameOrEmail] Username: " + username + " Email: " + email);
            const query = "SELECT * FROM users WHERE username = ? OR email = ?";
            const params = [username, email];
            dbConn.query(query, params, function (err, rows, fields) {
                if (err) throw err;
                console.log("[authAPI/existsUserWithUsernameOrEmail] Found: ", rows);
                if (rows.length > 0) {
                    console.log("[authAPI/existsUserWithUsernameOrEmail] Found user with username " + username + " or email " + email);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({exists: true}));
                } else {
                    console.log("[authAPI/existsUserWithUsernameOrEmail] No user with username " + username + " or email " + email + " found");
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({exists: false}));
                }
            });
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({exists: true}));
        }
    } else if (req.method === 'POST' && req.url.includes('/api/updateAccount')) {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            if (body === '') {
                res.writeHead(400);
                res.end('[authAPI/updateAccount] No parameters sent');
            }
            const data = JSON.parse(body);
            const username = data.username;
            const email = data.email;
            const sessionId = data.sessionId;
            const saltedPassword = data.password + username;

            const hashedPassword = crypto.createHash('sha256').update(saltedPassword).digest('hex');
            console.log("[authAPI/updateAccount] Username: " + username + " Password: " + saltedPassword + "hashedPassword: " + hashedPassword);


            const query = "UPDATE users SET username = ?, password = ?, email = ? WHERE session_id = ?";
            const params = [username, hashedPassword, email, sessionId];
            dbConn.query(query, params, function (err, rows, fields) {
                if (err) {
                    res.writeHead(500);
                    res.end('[authAPI/updateAccount] Error updating user ' + username + ' in database');
                    throw err;
                }
                console.log("[authAPI/updateAccount] Updated user " + username + " in database");
            });
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({updated: true}));
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(3005, () => {
    console.log('Authentication microservice running at http://localhost:3005/');
});
