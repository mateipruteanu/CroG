import {topButtonManager} from "/scripts/topButtonManager.js";

topButtonManager();

let queryString = window.location.search;

let searchBarText = document.getElementById("searchInput");

queryString = queryString.replace("?query=", "");
queryString = decodeURIComponent(queryString);
console.log("[searchBeginning] queryString: \"" + queryString + "\"");

if(queryString === undefined || queryString === null || queryString === "") {
    queryString = " ";
}

console.log("[searchAfter] queryString: \"" + queryString + "\"");

searchBarText.value = queryString;

class Card {
  constructor(id, title, description, url, tags, image) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.url = url;
    this.tags = tags;
    this.image = image; /// tbd
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
      <a href="${card.url}"  target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: wheat; " ><h2>Title: ${card.title} </h2></a>
      <p>Desc: ${card.description}</p>
      <ul>
        ${card.tags.map((tag) => `<li>${tag}</li>`).join("")}
      </ul>
    `;
    searchResults.appendChild(cardElement);
  }
}

let jsonData;
let request = new XMLHttpRequest();

request.open("GET", "http://localhost:3007/api/getResources", true);
request.onload = function () {
  jsonData = JSON.parse(this.response);
  console.log("data :" + JSON.stringify(jsonData));
  if (request.status >= 200 && request.status < 400) {
    for (let resource of jsonData) {
      cards.push(
          new Card(
                resource.id,
                resource.name,
                resource.description,
                resource.url,
                ["tag1", "tag2"],
          )
      );
    }
    console.log(cards);
    showAllCards();
    searchForCards();
  }
  else {
   console.log("error");

  }

};
request.send();
console.log("data :" + JSON.stringify(jsonData));

function searchForCards() {
  function cardMatches(cardContent) {
    const searchQueryArray = queryString.split(" ");
    if (queryString.length === 0) {
      console.log("no query, showing all cards");
      showAllCards();
      return true;
    }
    for (let keyword of searchQueryArray) {
      if (cardContent.toLowerCase().includes(keyword.toLowerCase())) {
        return true;
      }
    }
    return false;
  }
  let documentCards = document.querySelectorAll(".card");
  console.log("number of cards:" + documentCards.length)
  for (var i = 0; i < documentCards.length; i++) {
    if (cardMatches(documentCards[i].innerText)) {
      documentCards[i].classList.remove("isHidden");
    } else {
      documentCards[i].classList.add("isHidden");
    }
  }
}

searchForCards();

class filter {
  constructor(name, tags) {
    this.name = name;
    this.tags = tags;
  }
}

let filters = [
  new filter("Language", ["c++", "javascript", "python", "java"]),
  new filter("Operating System", ["linux", "unix", "windows", "macos"]),
  new filter("Other", [
    "web programming",
    "socket",
    "react",
    "framework",
    "coding",
    "creative",
  ]),
];

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
          .map(
            (tag) =>
              `
              <div class="filterTag">
                <label class="filterLabel" for="${tag}">${tag}</label>
                <input class = "checkbox" type="checkbox" id="${tag}" name="${tag}" value="${tag}">
                <br>
              </div>
              `
          )
          .join("")}
      </div>
    `;
    filterDiv.appendChild(filterElement);
  }
  let saveButton = document.createElement("button");
  saveButton.id = "saveButton";
  saveButton.innerHTML = "Save";
  filterDiv.appendChild(saveButton);
}

showAllFilters();

let saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", () => {
  let checkedBoxes = document.querySelectorAll("input[type=checkbox]:checked");
  let checkedValues = [];
  for (let checkedBox of checkedBoxes) {
    checkedValues.push(checkedBox.value);
  }
  queryString = checkedValues.join(" ");
  searchForCards();
});

let typingTimer;
let typeInterval = 500;

searchBarText.addEventListener("keyup", () => {
  queryString = searchBarText.value;
  clearTimeout(typingTimer);
  typingTimer = setTimeout(searchForCards, typeInterval);
});
