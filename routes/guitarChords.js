const express = require('express');
const router = express.Router();
const guitarChordsController = require("../controllers/guitarChordsController");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/", guitarChordsController.index);  
router.get("/add-song/:artist?", guitarChordsController.getAddSong);
router.get("/edit-song/:artist/:title", urlencodedParser, guitarChordsController.getEditSong);
router.get("/:artist/", guitarChordsController.artistList);
router.get("/:artist/:title", guitarChordsController.song);

module.exports = router;