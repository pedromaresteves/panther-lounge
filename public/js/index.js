import pagination from "./pagination.js";
import Fuse from 'fuse.js';
import { Query } from "mongoose";

export default function index() {
  pagination();
  
  const freeSearchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const artistResults = document.getElementById("artist-list");
  const songResults = document.getElementById("song-list");
  let songDb = [];
  let fuse;
  let result;

  function addItemsToList() {
    var node = document.createElement("LI");
    var textnode = document.createTextNode("Water");
    node.appendChild(textnode);
    artistResults.getElementById("myList").appendChild(node);
  }

  freeSearchInput.addEventListener("keyup", event => {
    let artistsArr = [];
    result = fuse.search(freeSearchInput.value);
    artistResults.innerHTML = "";
    songResults.innerHTML = "";
    result.forEach(function(item){
      if(artistsArr.indexOf(item.artist) === -1){
        artistsArr.push(item.artist);
        console.log(artistsArr);
        artistResults.innerHTML += `<li class="list-group-item"><a href="/guitar-chords/${item.nArtist}">${item.artist} <small>(Artist Page)</small></a></li>`
        //searchResults.innerHTML += `<li class="list-group-item"><a href="/guitar-chords/${item.nArtist}">${item.artist} <small>(Artist Page)</small></a></li>`
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
          const response = JSON.parse(httpRequest.response);
          songDb = response;
          console.log(songDb);
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
          fuse = new Fuse(songDb, options); // "list" is the item array
        
        }
    };
  httpRequest.open('GET', `${window.location.origin}${window.location.pathname.replace("guitar-chords", "api")}/get-all-results`);
  httpRequest.send();

}