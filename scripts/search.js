let queryString = window.location.search;
console.log(queryString);

let searchBarText = document.getElementById("searchInput");

queryString = queryString.replace("?search=", "");
queryString = decodeURIComponent(queryString);

searchBarText.textContent = queryString;

class Card {
  constructor(id, title, description, tags) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.tags = tags;
  }
}

let cards = [
  new Card(1, "Card 1", "This is card 1", ["tag1", "tag2"]),
  new Card(2, "Card 2", "This is card 2", ["tag1", "tag2"]),
  new Card(3, "Card 3", "This is card 3", ["tag1", "tag2"]),
  new Card(4, "Card 4", "This is card 4", ["tag1", "tag2"]),
  new Card(5, "Card 5", "This is card 5", ["tag1", "tag2"]),
  new Card(6, "Card 6", "This is card 6", ["tag1", "tag2"]),
  new Card(7, "Card 7", "This is card 7", ["tag1", "tag2"]),
];

let searchResults = document.getElementById("searchResults");
searchResults.innerHTML = "";

for(let i in cards) {
  let cardElement = document.createElement("div");
  cardElement.id = `card-${cards[i].id}`;
  cardElement.classList.add("card");
  cardElement.innerHTML = `
    <h2>Title: ${cards[i].title}</h2>
    <p>Desc: ${cards[i].description}</p>
    <ul>
      ${cards[i].tags.map((tag) => `<li>${tag}</li>`).join("")}
    </ul>
    `;
  searchResults.appendChild(cardElement);
}
