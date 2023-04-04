let queryString = window.location.search;

let searchBarText = document.getElementById("searchInput");

queryString = queryString.replace("?search=", "");
queryString = decodeURIComponent(queryString);
console.log(queryString);

searchBarText.value = queryString;

class Card {
  constructor(id, title, description, tags) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.tags = tags;
  }
}

let cards = [
  new Card(1, "Card 1", "This is card 1", ["c++", "javascript"]),
  new Card(2, "Card 2", "This is card 2", ["c++", "oop"]),
  new Card(3, "Card 3", "This is card 3", ["web programming", "socket"]),
  new Card(4, "Card 4", "This is card 4", ["react", "framework"]),
  new Card(5, "Card 5", "This is card 5", ["coding", "creative"]),
  new Card(6, "Card 6", "This is card 6", ["linux", "unix"]),
  new Card(7, "Card 7", "This is card 7", ["tag1", "tag2"]),
];

let searchResults = document.getElementById("searchResults");
searchResults.innerHTML = "";

function showAllCards() {
  for (let card of cards) {
    let cardElement = document.createElement("div");
    cardElement.id = `card-${cards.id}`;
    cardElement.classList.add("card");
    cardElement.classList.add("isHidden");
    cardElement.innerHTML = `
      <h2>Title: ${card.title}</h2>
      <p>Desc: ${card.description}</p>
      <ul>
        ${card.tags.map((tag) => `<li>${tag}</li>`).join("")}
      </ul>
    `;
    searchResults.appendChild(cardElement);
  }
}

showAllCards();

function searchForCards() {
  function cardMatches(cardContent) {
    const searchQueryArray = queryString.split(" ");
    if (searchQueryArray.length == 0) return true;
    for (let keyword of searchQueryArray) {
      if (cardContent.toLowerCase().includes(keyword.toLowerCase())) {
        return true;
      }
    }
    return false;
  }
  let documentCards = document.querySelectorAll(".card");
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
