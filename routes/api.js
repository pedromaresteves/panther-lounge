const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json()
const apiController = require("../controllers/apiController");

router.get("/guitar-chords", jsonParser, apiController.paginationArtists);
router.get("/guitar-chords/get-all-results", jsonParser, apiController.getAllResults);
router.get("/profile", jsonParser, apiController.profileSongs);
router.get("/guitar-chords/:artist", jsonParser, apiController.paginationSongsByArtist);
router.post("/guitar-chords/add-song/:artist?", jsonParser, apiController.addSong);
router.post("/guitar-chords/edit-song/:artist/:title", jsonParser, apiController.editSong);
router.delete("/guitar-chords/:artist/:title", jsonParser, apiController.deleteSong);


module.exports = router;