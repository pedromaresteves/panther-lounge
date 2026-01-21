const express = require('express');
const router = express.Router();
const guitarChordsController = require('../controllers/guitarChordsController');

// Use express built-in urlencoded parser for routes that expect form data
router.use(express.urlencoded({ extended: false }));

router.get('/', guitarChordsController.index);
router.get('/add-song/:artist?', guitarChordsController.getAddSong);
router.get('/edit-song/:artist/:title', guitarChordsController.getEditSong);
router.get('/:artist/', guitarChordsController.artistList);
router.get('/:artist/:title', guitarChordsController.song);

module.exports = router;