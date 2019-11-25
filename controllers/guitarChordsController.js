const SongModel = require("../models/song");
const UserModel = require("../models/user");
const utils = require("../utils/utils");

module.exports = {
    index : function(req, res){ //SONGS IN SONG BANK
      let makeSongUrl = `guitar-chords/add-song`;
      res.render("guitarChords.ejs", {userData: req.user, makeSongUrl: makeSongUrl}); 
    },
    artistList : function(req, res){ //SONGS ACCORDING TO ARTIST
      let makeSongUrl = `guitar-chords/add-song/${utils.encodeChars(req.params.artist)}`;
      res.render("artistPage.ejs", {userData: req.user, makeSongUrl: makeSongUrl})
    },
    song : async function(req,res){ //Get song from DB and Paint it
      let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
      let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
      let songCreatorData;
      let song = await SongModel.findOne({nTitle: titleRegex, nArtist: artistRegex});
      song.lyricsChords = JSON.stringify(song.lyricsChords);
      if(song.songCreator){
        songCreatorData = await UserModel.findOne({ _id : song.songCreator });
        song.songCreator = songCreatorData.username;
      }
      song.nArtist = utils.encodeChars(song.nArtist);
      res.render("songs.ejs", {userData: req.user, songData: song});
    },
    getAddSong : function(req,res){   
      const songData = {
        artist: req.params.artist,
        title: "",
        lyricsChords: undefined
      };
      res.render("addOrEditSong.ejs", {userData: req.user, songData:songData})
    },
    getEditSong : function(req,res){
      let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
      let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
      SongModel.findOne({nTitle: titleRegex, nArtist: artistRegex}).then(result => {
        result.lyricsChords = JSON.stringify(result.lyricsChords);
        res.render("addOrEditSong.ejs", {userData: req.user, songData : result})
      }).catch(err => {
        res.render("error.ejs", {userData: req.user, url: req.url, errorMessage: err.message});
      });
    },
}