var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const SongModel = require("../models/song");
const utils = require("../utils/utils");

//FIND SONG AND DELETE IT
router.delete("/:artist/:song", urlencodedParser, function(req, res) {
    let artistParamUnhiphenized = utils.unhiphenize(req.params.artist);
    let songParamUnhuphenized = utils.unhiphenize(req.params.song);
    let artistRegex = new RegExp("^" + artistParamUnhiphenized + "$", "gi");
    let songRegex = new RegExp("^" + songParamUnhuphenized + "$", "gi");

    const data = {
        redirectUrl: "",
        deletedMsg: "The song was deleted. Bye bye! :("
    };
    SongModel.findOneAndDelete({artist: artistRegex, title: songRegex}).then(result => {
        return SongModel.findOne({artist: artistRegex});
    }).then(result =>{
        if(result){
            res.send(data);
            return true;
        }
        data.redirectUrl = "http://127.0.0.1:3000/guitar-chords";
        res.send(data);
    });
    
});  

module.exports = router;