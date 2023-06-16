import {topButtonManager} from "/scripts/topButtonManager.js";

topButtonManager();

let searchBarText = document.getElementById("searchInput");

searchBarText.addEventListener("keypress", function (e)  {
    if (e.key === "Enter") {
        e.preventDefault();
        const query = encodeURIComponent(searchBarText.value);
        window.location.href = "/search?query=" + query;
    }
});

