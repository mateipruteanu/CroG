import {topButtonManager} from "/scripts/topButtonManager.js";

topButtonManager();

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", (key) => {
    if (key.code === "Enter") {
        window.location.href = `./search?query=${encodeURIComponent(
            searchInput.value
        )}`;
    }
});
