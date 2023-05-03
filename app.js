let http = require("http");
let path = require("path");
const router = require("./utils/router.js");


let server = http.createServer(function (request, response) {    
  var path = request.url;
  router.route(request, response, path); 
  
  if(request.method == "POST" && path === "/login"){
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
      // use validate function to validate login values
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