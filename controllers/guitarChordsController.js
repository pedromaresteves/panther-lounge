const SongModel = require("../models/song");
const UserModel = require("../models/user");
const utils = require("../utils/utils");

module.exports = {
    index : function(req, res){ //SONGS IN SONG BANK
      res.render("guitarChords.ejs", {userData: req.user}); 
    },
    artistList : function(req, res){ //SONGS ACCORDING TO ARTIST
      res.render("artistPage.ejs", {userData: req.user, artistParam: req.params.artist})
    },
    song : async function(req,res){ //Get song from DB and Paint it
      let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
      let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
      let songData = {
        songCreator: "Temp User"
      };
      let songCreatorData;
      let song = await SongModel.findOne({nTitle: titleRegex, nArtist: artistRegex});
      songData.artist = song.artist;
      songData.title = song.title;
      songData.nArtist = song.nArtist;
      songData.nTitle = song.nTitle; 
      if(song.songCreator){
        songCreatorData = await UserModel.findOne({ _id : song.songCreator });
        songData.songCreator = songCreatorData.username;
      }
      res.render("songs.ejs", {userData: req.user, songData: songData});
    },
    getAddSong : function(req,res){   
      res.render("addOrEditSong.ejs", {userData: req.user, songData:{artist:req.params.artist}})
    },
    getEditSong : function(req,res){
      let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
      let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
      SongModel.findOne({nTitle: titleRegex, nArtist: artistRegex}).then(result => {
        res.render("addOrEditSong.ejs", {userData: req.user, songData : result})
      }).catch(err => {
        res.render("error.ejs", {userData: req.user, url: req.url, errorMessage: err.message});
      });
    },
}