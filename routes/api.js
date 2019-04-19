var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json()
const SongModel = require("../models/song");
const utils = require("../utils/utils");
var apiController = require("../controllers/apiController");

//ADD SONG
router.post("/add-song/:artist?", jsonParser, apiController.addSong);
//EDIT SONG
router.post("/edit-song/:artist/:title", jsonParser, apiController.editSong);
//FIND SONG AND DELETE IT
router.delete("/:artist/:title", jsonParser, apiController.deleteSong);  


module.exports = router;