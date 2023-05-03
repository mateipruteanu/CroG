var http = require("http");
var fs = require("fs");

function route(request, response, path) {
  
  if(path.indexOf("?") != -1) {
    path = path.substring(0, path.indexOf("?"));
  }
  console.log("path " + path + "\n");


  if (path === "/") {
    fs.readFile("./pages/index.html", function (error, content) {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(content, "utf-8");
    });
  } else if (path === "/account") {
    fs.readFile("./pages/account.html", function (error, content) {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(content, "utf-8");
    });
  } else if (path === "/addresource") {
    fs.readFile("./pages/addresource.html", function (error, content) {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(content, "utf-8");
    });
  } else if (path === "/login") {
    fs.readFile("./pages/login.html", function (error, content) {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(content, "utf-8");
    });
  } else if (path === "/signup") {
    fs.readFile("./pages/signup.html", function (error, content) {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(content, "utf-8");
    });
  } else if (path === "/auth") {
    fs.readFile("./pages/auth.html", function (error, content) {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(content, "utf-8");
    });
  } else if (path === "/search") {
    fs.readFile("./pages/search.html", function (error, content) {
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


module.exports = { route };