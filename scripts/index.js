const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", (key) => {
  if (key.code === "Enter") {
    window.location.href = `./search.html?search=${encodeURIComponent(
      searchInput.value
    )}`;
  }
});

