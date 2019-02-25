import addSongScript from "./addSong.js";
import testy from "./testpoop.js";

console.log(window.location.pathname);

if(window.location.pathname === "/guitar-chords/add-song"){
    addSongScript();
}
if(window.location.pathname.indexOf("/guitar-chords/edit-song") != -1 &&  window.location.pathname.indexOf("/guitar-chords/edit-song-success") === -1){
    addSongScript();
}

if(window.location.pathname === "/guitar-chords"){
    testy();
}