let http = require("http");
let path = require("path");
const router = require("./utils/router.js");
const db = require("./utils/DbConn.js");

let server = http.createServer(function (request, response) {    
  var path = request.url;

  if (path.indexOf("?") != -1) {
    path = path.substring(0, path.indexOf("?"));
  }

  db.connect();
  router.route(request, response, path, request.method); 
  
  let cookies = request.headers.cookie;
  console.log("cookies: " + cookies + "\n");
  
  if(request.method == "POST" && path === "/login"){
    console.log("trying to login\n\n");
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      let pairs = body.split("&");
      let username = pairs[0].split("=")[1];
      let password = pairs[1].split("=")[1];
      console.log("username: " + username + "\n");
      console.log("password: " + password + "\n")
      if(username === "admin" && password === "admin"){
        console.log("[admin logged in]\n\n");
        response.writeHead(302, { "Location": "/account" });
        response.end();
      }
      else{
        response.writeHead(302, { "Location": "/login" });
        response.end();
      }
    });
  }
  if (request.method == "POST" && path === "/signup") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      console.log("body: " + body + "\n");
      let pairs = body.split("&");
      let email = decodeURIComponent(pairs[0].split("=")[1]);
      let username = decodeURIComponent(pairs[1].split("=")[1]);
      let password = decodeURIComponent(pairs[2].split("=")[1]);
      let repeat_password = decodeURIComponent(pairs[3].split("=")[1]);
      console.log("email: " + email + "\n");
      console.log("username: " + username + "\n");
      console.log("password: " + password + "\n");
      console.log("repeat_password: " + repeat_password + "\n");
    });
  }

  

});

server.listen(3000);