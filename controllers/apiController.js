const mongoose = require('mongoose');
const SongModel = require("../models/song");
const utils = require("../utils/utils");
const stuff = require("../stuff.js");

mongoose.connect(stuff.dbconnection, {useNewUrlParser: true});

module.exports = {
    addSong : function(req,res){
        const newSong = new SongModel({
          artist: encodeURIComponent(req.body.artist.toLowerCase()),
          title: encodeURIComponent(req.body.title),
          lyricsChords: JSON.parse(req.body.lyricsAndChords).ops[0].insert
        });
        const data = {
            redirectUrl: "",
            errorMsg: ""
        };
        let newSongTitleRegex = new RegExp("^" + newSong.title + "$", "gi");
        SongModel.find({artist: newSong.artist, title: newSongTitleRegex}).then(result=>{
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
            artist: encodeURIComponent(req.body.artist.toLowerCase()),
            title: encodeURIComponent(req.body.title),
            lyricsChords: JSON.parse(req.body.lyricsAndChords).ops[0].insert
        });
        const data = {
            redirectUrl: `http://127.0.0.1:3000/guitar-chords/${utils.linkify(newSong.artist)}/${utils.linkify(newSong.title)}`,
            errorMsg: ""
        };
        let newSongTitleRegex = new RegExp("^" + newSong.title + "$", "gi");
        SongModel.find({artist: newSong.artist, title: newSongTitleRegex}).then(result=>{
            newSong.update();
            data.redirectUrl = `http://127.0.0.1:3000/guitar-chords/${utils.linkify(newSong.artist)}/${utils.linkify(newSong.title)}`;
            return res.send(data);
        });
    },
    deleteSong : function(req, res){ //SONGS IN SONG BANK
        console.log(req.params.artist, req.params.title);
        let artistRegex = new RegExp("^" + utils.unlinkify(encodeURIComponent(req.params.artist)) + "$", "gi");
        let titleRegex = new RegExp("^" + utils.unlinkify(encodeURIComponent(req.params.title)) + "$", "gi");
        const data = {
            redirectUrl: "",
            deletedMsg: "The song was deleted. Bye bye! :("
        };
        SongModel.findOneAndDelete({artist: artistRegex, title: titleRegex}).then(result => {
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