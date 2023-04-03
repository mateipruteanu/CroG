let queryString = window.location.search;
console.log(queryString);

let searchBarText = document.getElementById("searchInput");

queryString = queryString.replace("?search=", "");
queryString = decodeURIComponent(queryString);

searchBarText.textContent = queryString;


