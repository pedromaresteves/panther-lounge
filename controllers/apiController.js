const mongoose = require('mongoose');
const SongModel = require("../models/song");
const utils = require("../utils/utils");
const stuff = require("../stuff.js");

mongoose.connect(stuff.dbconnection, {useNewUrlParser: true});

module.exports = {
    addSong : function(req,res){
        const newSong = new SongModel({
          artist: req.body.artist,
          title: req.body.title,
          lyricsChords: JSON.parse(req.body.lyricsAndChords).ops[0].insert
        });
        const data = {
            redirectUrl: "",
            errorMsg: ""
        };
        SongModel.find({artist: newSong.artist, title: newSong.title}).then(result=>{
          if(result.length === 0){
            newSong.save();
            data.redirectUrl = `http://127.0.0.1:3000/guitar-chords/${utils.linkify(newSong.artist)}/${utils.linkify(newSong.title)}`;
            return res.send(data);
          }
          data.errorMsg = "This song already exists in your song bank!";
          return res.send(data);
        });
    },
    editSong : function(req,res){
        const newSong = new SongModel({
          artist: req.body.artist,
          title: req.body.title,
          lyricsChords: JSON.parse(req.body.lyricsAndChords).ops[0].insert
        });
        const data = {
            redirectUrl: `http://127.0.0.1:3000/guitar-chords/${utils.linkify(newSong.artist)}/${utils.linkify(newSong.title)}`,
            errorMsg: ""
        };
        SongModel.find({artist: newSong.artist, title: newSong.title}).then(result=>{
            newSong.update();
            data.redirectUrl = `http://127.0.0.1:3000/guitar-chords/${utils.linkify(newSong.artist)}/${utils.linkify(newSong.title)}`;
            return res.send(data);
        });
    },
    deleteSong : function(req, res){ //SONGS IN SONG BANK
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
    },
}