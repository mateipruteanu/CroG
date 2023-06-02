var http = require("http");
var fs = require("fs");
const routes = require("./routes.js");
const requestFunc = require("request");

function route(request, response, path, method) {
  console.log(method + ": " + path + "\n");

  if (method === "GET") {
    if (path === "/") {
      fs.readFile("./pages/index.html", function (error, content) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(content, "utf-8");
      });
    } else if (routes.includes(path)) {
      fs.readFile("./pages" + path + ".html", function (error, content) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(content, "utf-8");
      });
    } else if (path.indexOf(".css") !== -1) {
      fs.readFile("." + path, function (error, content) {
        response.writeHead(200, { "Content-Type": "text/css" });
        response.end(content, "utf-8");
      });
    } else if (path.indexOf(".js") !== -1) {
      fs.readFile("." + path, function (error, content) {
        response.writeHead(200, { "Content-Type": "text/javascript" });
        response.end(content, "utf-8");
      });
    } else if (path.indexOf(".ico") !== -1) {
      fs.readFile("." + path, function (error, content) {
        response.writeHead(200, { "Content-Type": "image/x-icon" });
        response.end(content, "utf-8");
      });
    } else if (path.indexOf(".svg") !== -1) {
      fs.readFile("." + path, function (error, content) {
        response.writeHead(200, { "Content-Type": "image/svg+xml" });
        response.end(content, "utf-8");
      });
    } 
     else {
      response.writeHead(404);
      response.end();
    }

    
  }
  if (method === "POST") {

    if (path === "/api/login" && method === "POST") {
      let body = "";

      request.on("data", (chunk) => {
        body += chunk;
      });

      request.on("end", () => {
        const loginServiceUrl = "http://localhost:3005/api/login";

        const options = {
          url: loginServiceUrl,
          method: "POST",
          body: body,
          headers: {
            "Content-Type": "application/json",
          },
        };

        requestFunc(options, (error, apiResponse, apiBody) => {
          if (error) {
            response.writeHead(500);
            response.end("Eroare internă de server");
          } else {
            response.writeHead(apiResponse.statusCode, {
              "Content-Type": "application/json",
            });
            response.end(apiBody);
          }
        });
      });
    } else {
      response.writeHead(404);
      response.end();
    }
  }
}

module.exports = { route };