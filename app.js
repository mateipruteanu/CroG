const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(302, { Location: "/about.html" });
    res.end();
  } else if (req.url === "/about.html") {
    fs.readFile("./about.html", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading about.html");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end("Page not found");
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
