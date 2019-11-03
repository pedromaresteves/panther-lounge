const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json()
const apiController = require("../controllers/apiController");

//PAGINATION Artists
router.get("/guitar-chords", jsonParser, apiController.paginationArtists);
//GET ALL RESULTS FOR FREE SEARCH
router.get("/guitar-chords/get-all-results", jsonParser, apiController.getAllResults);
//PROFILE SONGS
router.get("/profile", jsonParser, apiController.profileSongs);
//PAGINATION SongsByArtist
router.get("/guitar-chords/:artist", jsonParser, apiController.paginationSongsByArtist);
//SONG
router.get("/guitar-chords/:artist/:title", jsonParser, apiController.getLyricsNchords);
//ADD SONG
router.post("/guitar-chords/add-song/:artist?", jsonParser, apiController.addSong);
//EDIT SONG
router.post("/guitar-chords/edit-song/:artist/:title", jsonParser, apiController.editSong);
//FIND SONG AND DELETE IT
router.delete("/guitar-chords/:artist/:title", jsonParser, apiController.deleteSong);  


module.exports = router;