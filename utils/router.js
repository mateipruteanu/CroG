var http = require("http");
var fs = require("fs");
const routes = require("./routes.js");


function route(request, response, path, method) {
  console.log(method + ": " + path + "\n");

  if (method == "GET") {
    if(path === "/"){
      fs.readFile("./pages/index.html", function (error, content) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(content, "utf-8");
      });
    } else if (routes.includes(path)) {
      fs.readFile("./pages" + path + ".html", function (error, content) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(content, "utf-8");
      });
    } else if (path.indexOf(".css") != -1) {
      fs.readFile("." + path, function (error, content) {
        response.writeHead(200, { "Content-Type": "text/css" });
        response.end(content, "utf-8");
      });
    } else if (path.indexOf(".js") != -1) {
      fs.readFile("." + path, function (error, content) {
        response.writeHead(200, { "Content-Type": "text/javascript" });
        response.end(content, "utf-8");
      });
    } else if (path.indexOf(".ico") != -1) {
      fs.readFile("." + path, function (error, content) {
        response.writeHead(200, { "Content-Type": "image/x-icon" });
        response.end(content, "utf-8");
      });
    } else if (path.indexOf(".svg") != -1) {
      fs.readFile("." + path, function (error, content) {
        response.writeHead(200, { "Content-Type": "image/svg+xml" });
        response.end(content, "utf-8");
      });
    } else {
      response.writeHead(404);
      response.end();
    }
}
}

module.exports = { route };