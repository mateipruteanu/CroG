let fs = require("fs");
const routes = require("./routes.js");
const buttonFunctionality = require("./buttonFunctionality.js");
const getPage = require("./getPage.js");


function route(request, response, path, method) {

    if (method === "GET") {
        if (path === "/") {
            fs.readFile("./pages/index.html", function (error, content) {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.end(content, "utf-8");
            });
        } else if (path === "/logout") {
            buttonFunctionality.logout(request, response);
        } else if (path === "/account") {
            getPage.accountPage(request, response);
        } else if (path === "/login") {
            getPage.loginPage(request, response);
        } else if (path === "/addresource") {
            getPage.addResourcePage(request, response);
        } else if (path === "/deleteresource") {
            getPage.deleteResourcePage(request, response);
        } else if (routes.includes(path)) {
            fs.readFile("./pages" + path + ".html", function (error, content) {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.end(content, "utf-8");
            });
        } else if (path.indexOf(".css") !== -1) {
            fs.readFile("." + path, function (error, content) {
                response.writeHead(200, {"Content-Type": "text/css"});
                response.end(content, "utf-8");
            });
        } else if (path.indexOf(".js") !== -1) {
            fs.readFile("." + path, function (error, content) {
                response.writeHead(200, {"Content-Type": "text/javascript"});
                response.end(content, "utf-8");
            });
        } else if (path.indexOf(".ico") !== -1) {
            fs.readFile("." + path, function (error, content) {
                response.writeHead(200, {"Content-Type": "image/x-icon"});
                response.end(content, "utf-8");
            });
        } else if (path.indexOf(".svg") !== -1) {
            fs.readFile("." + path, function (error, content) {
                response.writeHead(200, {"Content-Type": "image/svg+xml"});
                response.end(content, "utf-8");
            });
        } else {
            response.writeHead(404);
            response.end();
        }
    }
    if (method === "POST") {
        if (path === "/login") {
            buttonFunctionality.login(request, response);
        } else if (path === "/signup") {
            buttonFunctionality.signup(request, response);
        } else if (path === "/addresource") {
            buttonFunctionality.addResource(request, response);
        } else if (path === "/deleteresource") {
            buttonFunctionality.deleteResource(request, response);
        } else if(path === "/account") {
            buttonFunctionality.updateAccount(request, response);
        }

    }
}

module.exports = {route};
