const http = require('http');
const dbConn = require('../utils/DbConn');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/login') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk;
    });
    
    req.on('end', () => {
      const data = JSON.parse(body);
      const username = data.username;
      const password = data.password;
      

      dbConn.query(
        "SELECT * FROM users WHERE username = '" +
          username +
          "' AND password = '" +
          password +
          "'",
        function (err, rows, fields) {
          if (err) throw err;
          console.log("Found: ", rows);
          if (rows.length > 0) {
            console.log("Login successful");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ authenticated: true }));
          } else {
            console.log("Login failed");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ authenticated: false }));
          }
          res.end();
        }
      );
    });
  } else {
    res.writeHead(404);
    res.end('Pagina nu a fost găsită');
  }
});

server.listen(3005, () => {
  console.log('Microserviciul de login a pornit pe portul 3005');
});