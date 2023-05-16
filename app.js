let http = require("http");
let path = require("path");
const router = require("./utils/router.js");
const DbConn = require("./utils/DbConn.js");


let server = http.createServer(function (request, response) {
  var path = request.url;
  if (path.indexOf("?") != -1) {
    path = path.substring(0, path.indexOf("?"));
  }

  // const xHttp = new XMLHttpRequest();
  // xHttp.open("GET", "http://localhost:3015", true);
  // xHttp.send();
  // xHttp.onreadystatechange = function () {
  //   if (this.readyState == 4 && this.status == 200) {
  //     console.log("response from localhost:3015: " + this.responseText);
  //   }
  // };


  router.route(request, response, path, request.method);

  let cookies = request.headers.cookie;
  console.log("cookies: " + cookies + "\n");

  // temporary login and signup code
  if (request.method == "POST" && path === "/login") {
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
      console.log("password: " + password + "\n");
      DbConn.query(
        "SELECT * FROM users WHERE username = '" +
          username +
          "' AND password = '" +
          password +
          "'",
        function (err, rows, fields) {
          if (err) throw err;
          console.log("Found: ", rows);
        }
      );
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