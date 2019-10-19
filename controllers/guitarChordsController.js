const SongModel = require("../models/song");
const utils = require("../utils/utils");

module.exports = {
    index : async function(req, res){ //SONGS IN SONG BANK
      res.render("guitarChords.ejs", {userData: req.user}); 
    },
    artistList : async function(req, res){ //SONGS ACCORDING TO ARTIST
      res.render("artistPage.ejs", {userData: req.user, artist: req.params.artist})
    },
    song : function(req,res){ //Get song from DB and Paint it
      let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
      let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
      SongModel.findOne({nTitle: titleRegex, nArtist: artistRegex}).then(result => {
        const lyricsChords = JSON.parse(result.lyricsChords).ops;
        if(!result.songCreater) result.songCreater = "Temp User"
        res.render("songs.ejs", {userData: req.user, artist: result.artist, nArtist: result.nArtist, title: result.title, songCreater: result.songCreater, song: lyricsChords});
      }).catch(err => {
        res.render("error.ejs", {userData: req.user, url: req.url, errorMessage: err.message})
      });
    },
    getAddSong : function(req,res){   
      res.render("addSong.ejs", {userData: req.user, songData:{artist:req.params.artist}})
    },
    getEditSong : function(req,res){
      let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
      let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
      SongModel.findOne({title: titleRegex, artist: artistRegex}).then(result => {
        res.render("addSong.ejs", {userData: req.user, songData : result})
      }).catch(err => {
        res.render("error.ejs", {userData: req.user, url: req.url, errorMessage: err.message});
      });
    },
}