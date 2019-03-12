import addSongScript from "./addSong.js";
import artistPageScript from "./artistPageScript.js";

const numOfSlashes = window.location.pathname.match(/\//g).length;

//CHECK ARTIST PAGE LOCATION
if(window.location.pathname.indexOf("/guitar-chords/") != -1 && window.location.pathname.indexOf("add-song") == -1 && numOfSlashes == 2){ 
    artistPageScript();
}

//CHECK ADD SONG PAGE LOCATION
if(window.location.pathname === "/guitar-chords/add-song"){ 
    addSongScript();
}

//CHECK EDIT SONG PAGE LOCATION
if(window.location.pathname.indexOf("/guitar-chords/edit-song") != -1 &&  window.location.pathname.indexOf("/guitar-chords/edit-song-success") === -1){
    addSongScript();
}