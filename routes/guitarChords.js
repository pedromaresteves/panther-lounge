var express = require('express');
var router = express.Router();
var guitarChordsController = require("../controllers/guitarChordsController");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/", guitarChordsController.index);  
router.get("/add-song", guitarChordsController.getAddSong);
router.get("/edit-song/:artist/:title", urlencodedParser, guitarChordsController.getEditSong);
router.get("/:artist/", guitarChordsController.artistList);
router.get("/:artist/:title", guitarChordsController.song);

module.exports = router;