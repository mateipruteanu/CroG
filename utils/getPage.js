const fs = require("fs");
const DbConn = require("./DbConn.js");


function loginPage(request, response) {
    const cookie = request.headers.cookie;
    if (cookie) {
        //     redirecting to account page if already logged in
        let sessionId = cookie.split("=")[1].trim();
        console.log("[router/login] Session ID: " + sessionId);
        response.writeHead(302, {
            Location: "/account",
        });
        response.end();
    } else {
        fs.readFile("./pages/login.html", function (error, content) {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(content, "utf-8");
        });
    }
}

function accountPage(request, response) {
    let cookies = request.headers.cookie;
    if (cookies === null || cookies === "") {
        response.writeHead(302, {
            Location: "/login",
        });
        response.end();
    } else {
        let sessionId = cookies.split("=")[1].trim();
        console.log("[router/account] Session ID: " + sessionId);
        // waiting for the database to update in case of a login
        setTimeout(function () {
            if (sessionId !== null || sessionId !== "") {
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
}

module.exports = {
    loginPage: loginPage,
    accountPage: accountPage,
}