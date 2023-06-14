let http = require("http");
let path = require("path");
const router = require("./utils/router.js");
const DbConn = require("./utils/DbConn.js");
const requestFunc = require("request");
const fs = require("fs");
const queryString = require("querystring");



let server = http.createServer(function (request, response) {
  let path = request.url;
  if (path.indexOf("?") !== -1) {
    path = path.substring(0, path.indexOf("?"));
  }

  router.route(request, response, path, request.method);
  let cookies = request.headers.cookie;
  console.log("cookies: " + cookies + "\n");

});

server.listen(3000);