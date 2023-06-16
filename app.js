let http = require("http");
const router = require("./utils/router.js");


let server = http.createServer(function (request, response) {
    let path = request.url;
    if (path.indexOf("?") !== -1) {
        path = path.substring(0, path.indexOf("?"));
    }

    router.route(request, response, path, request.method);
    let cookies = request.headers.cookie;

});

server.listen(3000);
