import addOrEditSong from "./addOrEditSong.js";
import artistPage from "./artistPage.js";
import guitarChords from "./guitarChords.js";
import profile from "./profile.js";
import songPong from "./song";

// Import VexChords exposer first
import './exposeVexChords';
// Import tooltip functionality
import "./../../components/tooltip.js";
// Initialize Bootstrap 5 tooltips
document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // ChordTooltip is initialized in tooltip.js
    console.log('Main module loaded');
});

const numOfSlashes = window.location.pathname.match(/\//g).length;

//CHECK INDEX AND ARTIST PAGE LOCATIONS
if (window.location.pathname.indexOf("/guitar-chords") != -1 && numOfSlashes == 1) {
    guitarChords();
}

//CHECK ARTIST PAGE LOCATION
if (window.location.pathname.indexOf("/guitar-chords/") != -1 && window.location.pathname.indexOf("add-song") == -1 && numOfSlashes == 2) {
    artistPage();
}

//CHECK ADD/EDIT SONG PAGE LOCATION AND LOAD SCRIPT
if (window.location.pathname.indexOf("/guitar-chords/add-song") != -1 || window.location.pathname.indexOf("/guitar-chords/edit-song") != -1) {
    addOrEditSong();
}

//SONG
if (window.location.pathname.indexOf("/guitar-chords") != -1
    && window.location.pathname.indexOf("/add-song") == -1
    && window.location.pathname.indexOf("/edit-song") == -1
    && numOfSlashes == 3) {
    console.log('Loading songPong for path:', window.location.pathname);
    songPong();
}

//PROFILE
if (window.location.pathname.indexOf("/profile") != -1) {
    profile();
}