let http = require("http");

function getUserIdBySessionId(sessionId) {
    return new Promise(function (resolve, reject) {
        let userId;

        let options = {
            host: "localhost",
            port: 3005,
            path: "/api/getUserBySessionId?sessionId=" + sessionId,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        const requestToApi = http.request(options, function (response) {
            let responseData = "";
            response.on("data", function (data) {
                responseData += data;
            });
            response.on("end", function () {
                const responseBody = JSON.parse(responseData);
                userId = responseBody.user.id;
                console.log("[getUserIdBySessionId] userId: " + userId);

                resolve(userId); // Resolve the promise with the userId
            });
        });

        requestToApi.on("error", function (error) {
            reject(error); // Reject the promise with the error, if any
        });

        requestToApi.end();
    });
}

module.exports = getUserIdBySessionId;
