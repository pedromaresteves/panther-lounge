const mongoose = require('mongoose');
const SongModel = require("../models/song");
const utils = require("../utils/utils");
const stuff = require("../stuff.js");

mongoose.connect(stuff.dbconnection, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB Connection Started");
});

module.exports = {
    index : function(req, res){ //CHORDS IN SONG BANK
      // 1.Get available artists
      // 2.Order Artists
      // 3.Get Number of Songs for each artist
      // 4.Generate link for each artist
      SongModel.distinct("artist").then(result =>{
        return result.sort(utils.orderAz);
      }).then(result => {
        let generatedArtistLink;
        let listOfArtists = [];
        for(let i = 0; i< result.length; i++){
          SongModel.countDocuments({artist:result[i]}).then(number=>{
            generatedArtistLink = utils.linkify(result[i]);
            listOfArtists.push({artist : result[i], nOfSongs : number, link : generatedArtistLink});
            if(i === result.length-1){
              return listOfArtists;
            }
          }).then(result => {
            if(result){
              res.render("guitarChords.ejs", {data: result}); 
            }
          }); 
        }
      });
    },
    artistList : function(req, res){ //SONGS ACCORDING TO ARTIST
      // 1. return songs from one artist
      // 2. order songs
      // 3. Generate link for each song
      let artistParamUnhiphenized = utils.unhiphenize(req.params.artist);
      var artistRegex = new RegExp("^" + artistParamUnhiphenized + "$", "gi");
      SongModel.find({artist: artistRegex}).then(result => {
        let artistName = result[0].artist; //Every result will have the same artistname, I just get the first.
        let songsAndLinks = [];
        let generateSongLink;
        for(let i = 0; i < result.length; i++){
          generateSongLink = utils.linkify(result[i].title);
          songsAndLinks.push({title : result[i].title, link : generateSongLink})
        }
        res.render("artistPage.ejs", {artist: artistName, data: songsAndLinks, artistParam : req.params.artist, recommended: {item : "Poop"}})
      }).catch(err => {
        res.render("error.ejs", {url: req.url, errorMessage : err.message})
      });
    },
    song : function(req,res){
      // 1. Get song from DB and Paint it
      let artistParamUnhiphenized = utils.unhiphenize(req.params.artist);
      let songParamUnhuphenized = utils.unhiphenize(req.params.song);
      let artistRegex = new RegExp("^" + artistParamUnhiphenized + "$", "gi");
      let songRegex = new RegExp("^" + songParamUnhuphenized + "$", "gi");
      SongModel.findOne({title: songRegex, artist: artistRegex}).then(result => {
        res.render("songs.ejs", {song:result.lyricsChords, artist:result.artist})
      }).catch(err => {
        console.log(req);
        res.render("error.ejs", {url: req.url, errorMessage: err.message})
      });
    },
    getAddSong : function(req,res){
        res.render("addSong.ejs", {songData:null})
    },
    postAddSong : function(req,res){
      const newSong = new SongModel({
        artist: req.body.artist,
        title: req.body.title,
        lyricsChords: JSON.parse(req.body.lyrics).ops[0].insert
      });
      newSong.save();
      res.redirect('/guitar-chords/add-song-success');
    },
    getAddSongSuccess : function(req,res){
      res.render("addSongSuccess.ejs");
    },
    getEditSong : function(req,res){
      let artistParamUnhiphenized = utils.unhiphenize(req.params.artist);
      let songParamUnhuphenized = utils.unhiphenize(req.params.song);
      let artistRegex = new RegExp("^" + artistParamUnhiphenized + "$", "gi");
      let songRegex = new RegExp("^" + songParamUnhuphenized + "$", "gi");
      SongModel.findOne({title: songRegex, artist: artistRegex}).then(result => {
        console.log(result);
        res.render("addSong.ejs", {songData : result})
      }).catch(err => {
        console.log(req);
        res.render("error.ejs", {url: req.url, errorMessage: err.message})
      });
    }
}