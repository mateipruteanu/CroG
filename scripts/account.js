import {topButtonManager} from "/scripts/topButtonManager.js";

topButtonManager();

// let queryString = window.location.search;
// console.log(queryString);
//
// let searchBarText = document.getElementById("searchInput");
//
// queryString = queryString.replace("?search=", "");
// queryString = decodeURIComponent(queryString);
//
// searchBarText.textContent = queryString;

let usernameElement = document.querySelector("#name");
let emailElement = document.querySelector("#email");

let request = new XMLHttpRequest();

let sessionId = document.cookie.split("=")[1];
let apiUrl = "http://localhost:3005/api/getUserBySessionId?sessionId=" + sessionId;

request.open("GET", apiUrl, true);
request.onload = function () {
    if(request.status === 200) {
        let jsonData = JSON.parse(request.responseText);
        console.log("[account] jsonData", jsonData);
        let user = jsonData.user;
        let username = user.username;
        let email = user.email;

        usernameElement.value = username;
        emailElement.value = email;
    }
    else {
        console.log("[account] request.status", request.status);
    }
};
request.send();
