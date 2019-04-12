import addSong from "./addSong.js";
import artistPage from "./artistPage.js";

$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        animated: 'fade',
        placement: 'bottom',
        html: true
    });
  });

const numOfSlashes = window.location.pathname.match(/\//g).length;

//CHECK ARTIST PAGE LOCATION
if(window.location.pathname.indexOf("/guitar-chords/") != -1 && window.location.pathname.indexOf("add-song") == -1 && numOfSlashes == 2){ 
    artistPage();
}

//CHECK ADD/EDIT SONG PAGE LOCATION AND LOAD SCRIPT
if(window.location.pathname.indexOf("/guitar-chords/add-song") != -1 || window.location.pathname.indexOf("/guitar-chords/edit-song") != -1){ 
    addSong();
}
