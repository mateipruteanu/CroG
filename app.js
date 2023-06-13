let http = require("http");
let path = require("path");
const router = require("./utils/router.js");
const DbConn = require("./utils/DbConn.js");
const requestFunc = require("request");
<<<<<<< Updated upstream
const fs = require("fs");
=======
const queryString = require("querystring");
>>>>>>> Stashed changes


let server = http.createServer(function (request, response) {
  var path = request.url;
  if (path.indexOf("?") !== -1) {
    path = path.substring(0, path.indexOf("?"));
  }

  router.route(request, response, path, request.method);


  let cookies = request.headers.cookie;
  console.log("cookies: " + cookies + "\n");

<<<<<<< Updated upstream
=======
  // temporary login and signup code
  if (request.method == "POST" && path === "/login") {
    console.log("trying to login\n\n");
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      console.log("[login]body: " + body + " end body" + "\n");
      let pairs = body.split("&");
      const username = pairs[0].split("=")[1];
      const password = pairs[1].split("=")[1];
      const userObject = {
        username: username,
        password: password,
      };
      const userJson = JSON.stringify(userObject);
      console.log("userJson: " + userJson + "\n");
      const loginServiceUrl = "http://localhost:3005/api/login";
      const options = {
        url: loginServiceUrl,
        method: "POST",
        body: userJson,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": userJson.length,
        },
      };
      requestFunc(options, function (error, response, body) {
        if (error) {
          console.log("error: " + error + "\n");
        }
        console.log("body: " + body + "\n");
      });
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
  if (request.method == "POST" && path === "/addresource") {
    console.log("trying to add resource\n\n");
    let body = "";
    //put in body the data from the form
    request.on("data", function (data) {
      body +=data;
    });
    request.on("end", function () {
      let parsedData=queryString.parse(body);
      console.log(parsedData);
    })
  }

>>>>>>> Stashed changes
});

server.listen(3000);