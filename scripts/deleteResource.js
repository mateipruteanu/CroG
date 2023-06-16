import {topButtonManager} from "/scripts/topButtonManager.js";

topButtonManager();

let deleteButton = document.getElementById("delete_id");
deleteButton.addEventListener("click", function () {
    let id = document.getElementById("resourceId").value;
    let url = "http://localhost:3000/deleteresource?resourceId=" + id;
    let request = new XMLHttpRequest();
    request.open("POST", url);
    request.send();
    request.onload = function () {
        if (request.status === 200) {
            let response = JSON.parse(request.responseText);
            if (response.deleted) {
                alert("Resource deleted successfully");
            } else {
                alert("Resource not found");
            }
        } else {
            alert("Error communicating with server");
        }
    }
});
