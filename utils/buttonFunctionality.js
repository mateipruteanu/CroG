const http = require("http");
const fs = require("fs");
const queryString = require("querystring");
const DbConn = require("./databaseConnection.js");
const getUserIdBySessionId = require("./IdRequestFunction.js");
const {parse} = require("querystring");

function addResource(request, response) {
    console.log("[/addresource] request received");
    let body = "";
    request.on("data", function (data) {
        body += data;
    });
    request.on("end", async function () {
        let parsedData = queryString.parse(body);
        console.log("[/addresource] parsedData", parsedData);
        let cookie = request.headers.cookie;
        let sessionId = cookie.split("=")[1];
        console.log("[/addresource] sessionId", sessionId);
        let userId = await getUserIdBySessionId(sessionId);
        const resourceObject = {
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
            host: 'localhost', port: 3006, path: '/api/addResource', method: 'POST', headers: {
                'Content-Type': 'application/json', 'Content-Length': resourceJson.length,
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
                                "Content-Type": "text/html", "Location": "/account",
                            });
                            response.end(content, "utf-8");
                        }
                    });
                    console.log("[/addresource] added resource successful\n");
                } else {
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
            "Content-Type": "text/html", "Location": "/account",
        });
        response.end();
    });
}

function signup(request, response) {
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
                email: email, username: username, password: password,
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
                    if (user.exists) {
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

function login(request, response) {
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
            username: username, password: password,
        };

        const userJson = JSON.stringify(userObject);
        console.log("[loginAppJS]userJson: " + userJson + "\n")

        const options = {
            host: 'localhost', port: 3005, path: '/api/login', method: 'POST', headers: {
                'Content-Type': 'application/json', 'Content-Length': userJson.length,
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

function signUpApiCall(response, userJson) {
    const signupOptions = {
        host: 'localhost', port: 3005, path: '/api/signup', method: 'POST', headers: {
            'Content-Type': 'application/json', 'Content-Length': userJson.length,
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
                            "Content-Type": "text/html", "Location": "/login",
                        });
                        response.end(content, "utf-8");
                    }
                });
                console.log("signup successful\n");
            } else {
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

function logout(request, response) {
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
            Location: "/", "Set-Cookie": "sessionId=; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        });
        response.end();
    } else {
        response.writeHead(302, {
            Location: "/",
        });
        response.end();
    }
}

function deleteResource(request, response) {
    console.log("[/deleteresource] request received");
    let body = "";
    request.on("data", function (data) {
        body += data;
    });
    request.on("end", function () {
        let parsedData = parse(body);
        let parsedResult = JSON.stringify(parsedData);
        console.log("[/deleteresource] parsedData", parsedData);
        const options = {
            host: "localhost", port: 3006, path: "/api/deleteResource", method: "POST", headers: {
                "Content-Type": "application/json",
            },
        };
        const requestToApi = http.request(options, function (responseFromApi) {
            let responseData = "";

            responseFromApi.on("data", function (data) {
                responseData += data;
            });

            responseFromApi.on("end", function () {
                const responseBody = JSON.parse(responseData);
                console.log("[/deleteresource] responseBody from API", responseBody);
                if (responseBody.deleted) {
                    fs.readFile("./pages/account.html", function (error, content) {
                        if (error) {
                            console.log(error);
                        } else {
                            response.writeHead(302, {
                                "Content-Type": "text/html", Location: "/account",
                            });
                            response.end(content, "utf-8");
                        }
                    });
                    console.log("[/deleteresource] deleted resource successful\n");
                } else {
                    console.log("[/deleteresource] delete resource failed\n");
                    fs.readFile("./pages/account.html", function (error, content) {
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
        requestToApi.on("error", function (error) {
            console.error(error);
        });
        requestToApi.write(parsedResult);
        requestToApi.end();

        response.writeHead(302, {
            "Content-Type": "text/html", Location: "/account",
        });
        response.end();
    });
}


module.exports = {
    login: login,
    logout: logout,
    signup: signup,
    addResource: addResource,
    deleteResource: deleteResource
}
