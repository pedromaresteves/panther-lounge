import getPageResults from "./getPageResults.js";
import Fuse from 'fuse.js';

export default function guitarChords() {
  let path = window.location.origin + "/api" + window.location.pathname + "/get-all-results";

  if(!window.location.search.match(/[0-9]/g)){
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
    result.forEach(function(item){
      if(artistsArr.indexOf(item.artist) === -1){
        artistsArr.push(item.artist);
        artistResults.innerHTML += `<li class="list-group-item"><a href="/guitar-chords/${item.nArtist}">${item.artist} <small>(Artist Page)</small></a></li>`
      }
      songResults.innerHTML += `<li class="list-group-item"><a href="/guitar-chords/${item.nArtist}/${item.nTitle}">${item.artist} - ${item.title}</a></li>`;
    })
  });

  let httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
    alert('Giving up :( Cannot create an XMLHTTP instance');
    return false;
    }
    
    httpRequest.onreadystatechange = function(){    
        if(httpRequest.readyState === 4){
          const songDb = JSON.parse(httpRequest.response);
          var options = {
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
          fuse = new Fuse(songDb, options);
        }
    };
  httpRequest.open('GET', path);
  httpRequest.send();

}