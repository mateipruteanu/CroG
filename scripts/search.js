import {topButtonManager} from "/scripts/topButtonManager.js";

topButtonManager();

let queryString = window.location.search;

let searchBarText = document.getElementById("searchInput");

queryString = queryString.replace("?query=", "");
queryString = decodeURIComponent(queryString);
console.log("[search.js] queryString: " + queryString);

searchBarText.value = queryString;

class Card {
    constructor(id, title, description, url, tags, image) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.url = url;
        this.tags = tags;
        this.image = image;
    }
}

let cards = [];

let searchResults = document.getElementById("searchResults");
searchResults.innerHTML = "";


function showAllCards() {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    for (let card of cards) {
        let cardElement = document.createElement("div");
        cardElement.id = `card-${card.id}`;
        cardElement.classList.add("card");
        cardElement.classList.add("isHidden");
        cardElement.innerHTML = `
      <a href="${card.url}"  target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: wheat; " ><h2 class="card_title">${card.title} </h2></a>
      <p class="res_id">#${card.id}</p>
      <p class="desc">${card.description}</p>
      <ul>
        ${card.tags.map((tag) => `<li>${tag}</li>`).join("")}
      </ul>
    `;
        searchResults.appendChild(cardElement);
    }
}

let jsonData;
let request = new XMLHttpRequest();

const queryObject = {
    query: queryString
}

const queryStringJSON = JSON.stringify(queryObject);

function sendPostRequest(queryStringJSON) {
    request.open("POST", "http://localhost:3007/api/getResourcesByNameOrTagsOrDescription", true);
    request.onload = function () {
        jsonData = JSON.parse(this.response);
        console.log("[postRequest] :" + JSON.stringify(jsonData));
        if (request.status >= 200 && request.status < 400) {
            for (let resource of jsonData) {
                cards.push(new Card(resource.resource_id, resource.name, resource.description, resource.url, [resource.tag_name]));
            }
            showAllCards();
            searchForCards();
        } else {
            console.log("error");

        }

    };
    request.send(queryStringJSON);
}

function sendGetAllResourcesRequest() {
    request.open("GET", "http://localhost:3007/api/getResources", true);
    request.onload = function () {
        jsonData = JSON.parse(this.response);
        console.log("[getAll] :" + JSON.stringify(jsonData));
        if (request.status >= 200 && request.status < 400) {
            for (let resource of jsonData) {
                cards.push(new Card(resource.resource_id, resource.name, resource.description, resource.url, [resource.tag_name]));
            }
            showAllCards();
            searchForCards();
        } else {
            console.log("error");

        }

    };
    request.send();
}

if (queryString !== "" || queryString !== null) {
    sendPostRequest(queryStringJSON);
} else {
    sendGetAllResourcesRequest();
}

function searchForCards() {
    function cardMatches(cardContent) {
        const searchQueryArray = queryString.split(" ");
        for (let keyword of searchQueryArray) {
            if (cardContent.toLowerCase().includes(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    let documentCards = document.querySelectorAll(".card");
    console.log("number of cards:" + documentCards.length)
    for (let documentCard of documentCards) {
        if (cardMatches(documentCard.innerText)) {
            documentCard.classList.remove("isHidden");
        } else {
            documentCard.classList.add("isHidden");
        }
    }
}


class filter {
    constructor(name, tags) {
        this.name = name;
        this.tags = tags;
    }
}

let filters = [new filter("Language", ["C++", "JavaScript", "Python", "Java"]), new filter("Operating System", ["Linux", "Cross-Platform", "Win", "Mac"]), new filter("Other", ["Image", "Socket", "React", "Framework", "Coding", "Creative",]),];

let filterDiv = document.getElementById("filtersDiv");
filterDiv.innerHTML = "";

function showAllFilters() {
    for (let filter of filters) {
        let filterElement = document.createElement("div");
        filterElement.id = `filter-${filter.name}`;
        filterElement.classList.add("filter");
        filterElement.innerHTML = `
      <h2>${filter.name}</h2>
      <div class="filterTags">
        ${filter.tags
            .map((tag) => `
              <div class="filterTag">
                <label class="filterLabel" for="${tag}">${tag}</label>
                <input class = "checkbox" type="checkbox" id="${tag}" name="${tag}" value="${tag}">
                <br>
              </div>
              `)
            .join("")}
      </div>
    `;
        filterDiv.appendChild(filterElement);
    }
    let saveButton = document.createElement("button");
    saveButton.id = "saveButton";
    saveButton.innerHTML = "Save";
    saveButton.classList.add("saveButton");
    filterDiv.appendChild(saveButton);
}

showAllFilters();

let saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", () => {

    let checkboxes = document.querySelectorAll(".checkbox");
    let isEmpty = true;
    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            isEmpty = false;
            console.log("checked: " + checkbox.value);
            let documentCards = document.querySelectorAll(".card");
            console.log("number of cards:" + documentCards.length)
            for (let documentCard of documentCards) {
                if (documentCard.innerText.toUpperCase().split(" ").map((word) => {
                    return word.toUpperCase() === checkbox.value.toUpperCase();
                }).includes(true)) {
                    documentCard.classList.remove("isHidden");
                } else {
                    documentCard.classList.add("isHidden");
                }
            }
        }
    }
    if (isEmpty) {
        let documentCards = document.querySelectorAll(".card");
        console.log("number of cards:" + documentCards.length)
        for (let i = 0; i < documentCards.length; i++) {
            console.log("card " + i + " matches and we show it");
            documentCards[i].classList.remove("isHidden");
        }
    }

});


searchBarText.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        const query = encodeURIComponent(searchBarText.value);
        window.location.href = "/search?query=" + query;
    }
});
