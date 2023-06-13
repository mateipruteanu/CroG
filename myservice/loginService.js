const http = require('http');
const crypto = require('crypto');
const dbConn = require('../utils/DbConn');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/login') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk;
    });
    
    req.on('end', () => {
        if(body === '') {
            res.writeHead(400);
            res.end('Nu s-a trimis niciun parametru');
            return;
        }
      const data = JSON.parse(body);
      const username = data.username;
      const password = data.password;
      

      dbConn.query(
        "SELECT * FROM users WHERE username = ? AND password = ?", [username, password],
        function (err, rows, fields) {
          if (err) throw err;
          console.log("Found: ", rows);
          if (rows.length > 0) {
            console.log("Login successful");

            // generating the session ID
            const sessionId = crypto.randomUUID();
            console.log("Session ID: ", sessionId);

            const query = "UPDATE users SET session_id = ? WHERE username = ?";
            const params = [sessionId, username];
            dbConn.query(query, params, function (err, rows, fields) {
                if (err) throw err;
                console.log("Updated session ID");
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ authenticated: true, sessionId: sessionId }));

          } else {
            console.log("Login failed");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ authenticated: false }));
          }
          res.end();
        }
      );
    });
  }
  else if(req.method === 'POST' && req.url === '/api/signup') {
      let body = '';
      req.on('data', (chunk) => {
          body += chunk;
      });

        req.on('end', () => {
            if(body === '') {
                res.writeHead(400);
                res.end('Nu s-a trimis niciun parametru');
                return;
            }
            const data = JSON.parse(body);
            const username = data.username;
            const password = data.password;
            const email = data.email;
            console.log("[signupAPI] Username: " + username + " Password: " + password + " Email: " + email)
            const query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
            const params = [username, password, email];
            dbConn.query(query, params, function (err, rows, fields) {
                if (err) throw err;
                console.log("Inserted new user " + username + " into database");
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ registered: true }));
        });

  }
  else {
      res.writeHead(302, { Location: '/' });
      res.end();
  }
});

server.listen(3005, () => {
  console.log('Microserviciul de login a pornit pe portul 3005');
});