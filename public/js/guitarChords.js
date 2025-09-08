import getPageResults from "./getPageResults.js";
import Fuse from 'fuse.js';

export default function guitarChords() {
  let path = window.location.origin + "/api" + window.location.pathname + "/get-all-results";

  if (!window.location.search.match(/[0-9]/g)) {
    getPageResults(1);
  } else {
    let currentPage = window.location.search.match(/[0-9]/g).join("");
    getPageResults(currentPage);
  }

  const freeSearchInput = document.getElementById("search-input");
  const artistResults = document.getElementById("artist-list");
  const songResults = document.getElementById("song-list");
  let fuse;
  let result;

  freeSearchInput.addEventListener("keyup", event => {
    let artistsArr = [];
    result = fuse.search(freeSearchInput.value);
    artistResults.innerHTML = "";
    songResults.innerHTML = "";
    result.forEach(function (song) {
      if (artistsArr.indexOf(song.item.artist) === -1) {
        artistsArr.push(song.item.artist);
        artistResults.innerHTML += `<li class="list-group-item"><a href="/guitar-chords/${song.item.nArtist}">${song.item.artist} <small>(Artist Page)</small></a></li>`
      }
      songResults.innerHTML += `<li class="list-group-item"><a href="/guitar-chords/${song.item.nArtist}/${song.item.nTitle}">${song.item.artist} - ${song.item.title}</a></li>`;
    })
  });

  fetch(path)
    .then(response => response.json())
    .then(data => {
      const options = {
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          "nTitle",
          "nArtist"
        ]
      };
      fuse = new Fuse(data, options);
    });
}