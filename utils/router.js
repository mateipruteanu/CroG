var http = require("http");
var fs = require("fs");
const DbConn = require("./DbConn.js");
const routes = require("./routes.js");
const requestFunc = require("request");
const queryString= require("querystring");

function route(request, response, path, method) {
  console.log( "[router]" + method + ": " + path + "\n");


  if (method === "GET") {
    if (path === "/") {
        fs.readFile("./pages/index.html", function (error, content) {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(content, "utf-8");
        });
    } else if (path === "/logout") {
        let cookies = request.headers.cookie;
        if (cookies) {
            let sessionId = cookies.split("=")[1];
            const query = "UPDATE users SET session_id = NULL WHERE session_id = ?";
            const params = [sessionId];
            DbConn.query(query, params, function (err, rows, fields) {
                if (err) throw err;
                console.log("[router/logout] Deleted session ID");
            });
            response.writeHead(302, {
                Location: "/",
                "Set-Cookie": "sessionId=; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
            });
            response.end();
        } else {
            response.writeHead(302, {
                Location: "/",
            });
            response.end();
        }
    } else if (path === "/account") {
        let cookies = request.headers.cookie;
        if(cookies === null || cookies === "") {
            response.writeHead(302, {
                Location: "/login",
            });
            response.end();
        }
        else {
            let sessionId = cookies.split("=")[1].trim();
            console.log("[router/account] Session ID: " + sessionId);
            // waiting for the database to update in case of a login
            setTimeout(function () {
                if(sessionId !== null || sessionId !== "") {
                    const query = "SELECT * FROM users WHERE session_id = ?";
                    const params = [sessionId];
                    DbConn.query(query, params, function (err, rows, fields) {
                        if (err) throw err;
                        if (rows.length > 0) {
                            console.log("[router/account] Found user: " + rows[0].username);
                            fs.readFile("./pages/account.html", function (error, content) {
                                response.writeHead(200, {"Content-Type": "text/html"});
                                response.end(content, "utf-8");
                            }
                            );
                        } else {
                            console.log("[router/account] No user found");
                            response.writeHead(302, {
                                Location: "/login",
                            });
                            response.end();
                        }
                    });
                } else {
                    console.log("[router/account] No session ID");
                    response.writeHead(302, {
                        Location: "/login",
                    });
                    response.end();
                }
            }, 100);
        }
    } else if (path === "/login") {
        const cookie = request.headers.cookie;
        if (cookie) {
        //     redirecting to account page if already logged in
            let sessionId = cookie.split("=")[1].trim();
            console.log("[router/login] Session ID: " + sessionId);
            response.writeHead(302, {
                Location: "/account",
            });
            response.end();
        }
        else {
            fs.readFile("./pages/login.html", function (error, content) {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.end(content, "utf-8");
            });
        }
    } else if (routes.includes(path)) {
      fs.readFile("./pages" + path + ".html", function (error, content) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(content, "utf-8");
      });
    }
    else if (path.indexOf(".css") !== -1) {
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
  if(method === "POST"){
    if (path === "/login") {

      let sessionId = "";
      console.log("trying to login");
      let body = "";
      request.on("data", function (data) {
        body += data;
      });
      request.on("end", function () {
        console.log("[loginAppJS]body: " + body + " end body" + "\n");
        let pairs = body.split("&");
        const username = decodeURIComponent(pairs[0].split("=")[1]);
        const password = decodeURIComponent(pairs[1].split("=")[1]);

        const userObject = {
          username: username,
          password: password,
        };

        const userJson = JSON.stringify(userObject);
        console.log("[loginAppJS]userJson: " + userJson + "\n")

        const options = {
          host: 'localhost',
          port: 3005,
          path: '/api/login',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': userJson.length,
          },
        };

        const requestToApi = http.request(options, function (responseFromApi) {
          let responseData = '';

          responseFromApi.on('data', function (chunk) {
            responseData += chunk;
          });

          responseFromApi.on('end', function () {
            const responseBody = JSON.parse(responseData);
            console.log(responseBody);
            if (responseBody.authenticated) {
              sessionId = responseBody.sessionId;

              fs.readFile("./pages/account.html", function (error, content) {
                if (error) {
                  console.log(error);
                  throw error;
                } else {
                  const oneWeekInSeconds = 7 * 24 * 60 * 60;
                  const expirationDate = new Date(Date.now() + oneWeekInSeconds * 1000);
                  const expires = expirationDate.toUTCString();

                  console.log("[router/login]------------before redirect");
                  response.writeHead(302, {
                    "Content-Type": "text/html",
                    'Set-Cookie': `sessionId=${sessionId}; Expires=${expires}; Path=/;`,
                    "Location": "/account",
                  });
                  response.end(content, "utf-8");
                  console.log("[router/login]------------after redirect");
                }
              });

              console.log("[login] login successful\n");
            } else {
              console.log("[login] login failed\n");
              fs.readFile("./pages/login.html", function (error, content) {
                if (error) {
                  console.log(error);
                } else {
                  response.writeHead(200, {
                    "Content-Type": "text/html",
                  });
                  response.end(content, "utf-8");
                }
              });
            }
          });
        });

        requestToApi.on('error', function (error) {
          console.error(error);
        });

        requestToApi.write(userJson);
        requestToApi.end();

        console.log("[login] ended response\n\n");
      });
    }
    else if (path === "/signup") {
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

        if (password === repeat_password) {
            const userObject = {
                email: email,
                username: username,
                password: password,
            };

            const userJson = JSON.stringify(userObject);
            console.log("userJson: " + userJson + "\n")

            const existsUserOptions = {
                host: 'localhost',
                port: 3005,
                path: '/api/existsUserWithUsernameOrEmail?username=' + username + '&email=' + email,
                method: 'GET',
            };

            const requestToExistsUserApi = http.request(existsUserOptions, function (responseFromExistsUserApi) {
                let existsUserData = '';

                responseFromExistsUserApi.on('data', function (chunk) {
                    existsUserData += chunk;
                });

                responseFromExistsUserApi.on('end', function () {
                    let user = JSON.parse(existsUserData);
                    if(user.exists) {
                        console.log("[router/signup] User exists already");
                        fs.readFile("./pages/signup.html", function (error, content) {
                            if (error) {
                                console.log(error);
                            } else {
                                response.writeHead(200, {
                                    "Content-Type": "text/html",
                                });
                                response.end(content, "utf-8");
                            }
                        });
                    } else {
                        signUpApiCall(response, userJson);
                    }
                });

            });
            requestToExistsUserApi.on('error', function (error) {
                console.error(error);
            });
            requestToExistsUserApi.end();
        }

      });
    }
    else if (path==="/addresource"){
        console.log("[/addresource] request received");
        let body = "";
        request.on("data", function (data) {
            body += data;
        });
        request.on("end", function () {
            let parsedData=queryString.parse(body);
            console.log("[/addresource] parsedData", parsedData);
            //TODO: obtain userId from cookie
            let userId=1;
            const resourceObject ={
                name: parsedData.name,
                description: parsedData.description,
                tags: parsedData.tags,
                category: parsedData.category,
                link: parsedData.link,
                language: parsedData.language,
                userId: userId,
            }
            const resourceJson = JSON.stringify(resourceObject);
            console.log("[/addresource] resourceJson", resourceJson);
            const options = {
                host: 'localhost',
                port: 3006,
                path: '/api/addResource',
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Content-Length': resourceJson.length,
                },
            };
            const requestToApi = http.request(options, function (responseFromApi) {
               let responseData = '';

                responseFromApi.on('data', function (chunk) {
                    responseData += chunk;
                });

                responseFromApi.on('end', function () {
                    const responseBody = JSON.parse(responseData);
                    console.log("[/addresource] responseBody from API", responseBody);
                    if (responseBody.added) {
                        fs.readFile("./pages/account.html", function (error, content) {
                            if (error) {
                                console.log(error);
                            } else {
                                response.writeHead(302, {
                                    "Content-Type": "text/html",
                                    "Location": "/account",
                                });
                                response.end(content, "utf-8");
                            }
                        });
                        console.log("[/addresource] added resource successful\n");
                    }
                    else {
                        console.log("[/addresource] add resource failed\n");
                        fs.readFile("./pages/addresource.html", function (error, content) {
                            if (error) {
                                console.log(error);
                            } else {
                                response.writeHead(200, {
                                    "Content-Type": "text/html",
                                });
                                response.end(content, "utf-8");
                            }
                        });
                    }
                });
            });

            requestToApi.on('error', function (error) {
                console.error(error);
            });

            requestToApi.write(resourceJson);
            requestToApi.end();

            response.writeHead(302, {
                "Content-Type": "text/html",
                "Location": "/account",
            });
            response.end();
        });
    }
  }

}

module.exports = { route };

function signUpApiCall(response, userJson) {
    const signupOptions = {
        host: 'localhost',
        port: 3005,
        path: '/api/signup',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': userJson.length,
        },
    };

    const requestToApi = http.request(signupOptions, function (responseFromApi) {
        let responseData = '';

        responseFromApi.on('data', function (chunk) {
            responseData += chunk;
        });

        responseFromApi.on('end', function () {
            const responseBody = JSON.parse(responseData);
            console.log("[router/signup]responseBody from API", responseBody);
            if (responseBody.registered) {
                fs.readFile("./pages/login.html", function (error, content) {
                    if (error) {
                        console.log(error);
                    } else {
                        response.writeHead(302, {
                            "Content-Type": "text/html",
                            "Location": "/login",
                        });
                        response.end(content, "utf-8");
                    }
                });
                console.log("signup successful\n");
            }
            else {
                console.log("signup failed\n");
                fs.readFile("./pages/signup.html", function (error, content) {
                    if (error) {
                        console.log(error);
                    } else {
                        response.writeHead(200, {
                            "Content-Type": "text/html",
                        });
                        response.end(content, "utf-8");
                    }
                });
            }
        });
    });

    requestToApi.on('error', function (error) {
        console.error(error);
    });

    requestToApi.write(userJson);
    requestToApi.end();
    console.log("ended response\n\n");
}