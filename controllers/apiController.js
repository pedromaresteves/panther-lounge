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
          lyricsChords: req.body.lyricsAndChords,
          nArtist: req.body.artist.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
          nTitle: req.body.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        });
        const data = {
            redirectUrl: "",
            errorMsg: ""
        };
        let newSongTitleRegex = new RegExp("^" + newSong.title + "$", "gi");
        SongModel.find({artist: newSong.artist, title: newSongTitleRegex}).then(result=>{
          if(result.length === 0){
            newSong.save();
            data.redirectUrl = `http://127.0.0.1:3000/guitar-chords/${utils.encodeChars(newSong.nArtist)}/${utils.encodeChars(newSong.nTitle)}`;
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
            lyricsChords: req.body.lyricsAndChords,
            nArtist: req.body.artist.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
            nTitle: req.body.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        });
        const data = {
            redirectUrl: `http://127.0.0.1:3000/guitar-chords/${utils.encodeChars(newSong.nArtist)}/${utils.encodeChars(newSong.nTitle)}`,
            errorMsg: ""
        };
        let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
        let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
        SongModel.updateOne({nArtist: artistRegex, nTitle: titleRegex},
            { $set: {lyricsChords: newSong.lyricsChords, title: newSong.title, nTitle: newSong.nTitle}}).then(result=>{
            return res.send(data);
        });
    },
    deleteSong : function(req, res){ //SONGS IN SONG BANK
        let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
        let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
        const data = {
            redirectUrl: "",
            deletedMsg: "The song was deleted. Bye bye! :("
        };
        SongModel.findOneAndDelete({nArtist: artistRegex, nTitle: titleRegex}).then(result => {
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