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
    index : function(req, res){ //SONGS IN SONG BANK
      SongModel.aggregate([
        //The lowerName property is only used to sort by name
        {$group:{_id : {name : "$artist", lowerName: { "$toLower": "$artist" }}, total : { $sum: 1 }}},
        {$sort:{'_id.lowerName' : 1}}
        ]).then(result=>{
          let finalArray = [];
          result.forEach(function(item){
            finalArray.push({artist: decodeURIComponent(utils.capitalizeName(item._id.name)), nOfSongs: item.total, link: utils.linkify(item._id.name)})
          });
          res.render("guitarChords.ejs", {data: finalArray}); 
        });
    },
    artistList : function(req, res){ //SONGS ACCORDING TO ARTIST
      let encodedArtistName = utils.unlinkify(encodeURIComponent(req.params.artist));  
      let artistRegex = new RegExp("^" + encodedArtistName + "$", "gi");
      SongModel.find({artist: artistRegex}).then(result => {
        let artistName = decodeURIComponent(result[0].artist); //Every result will have the same artistname, I just get the first.
        let songsAndLinks = [];
        let generateSongLink;
        for(let i = 0; i < result.length; i++){
          generateSongLink = utils.linkify(result[i].title);
          songsAndLinks.push({title : decodeURIComponent(result[i].title), link : generateSongLink})
        }
        res.render("artistPage.ejs", {artist: utils.capitalizeName(artistName), data: songsAndLinks, artistParam : encodeURIComponent(req.params.artist), recommended: {item : "Poop"}})
      }).catch(err => {
        res.render("error.ejs", {url: req.url, errorMessage : err.message})
      });
    },
    song : function(req,res){ //Get song from DB and Paint it
      let artistRegex = new RegExp("^" + utils.unlinkify(encodeURIComponent(req.params.artist)) + "$", "gi");
      let titleRegex = new RegExp("^" + utils.unlinkify(encodeURIComponent(req.params.title)) + "$", "gi");
      SongModel.findOne({title: titleRegex, artist: artistRegex}).then(result => {
        res.render("songs.ejs", {song:result.lyricsChords, artist: decodeURIComponent(result.artist)})
      }).catch(err => {
        res.render("error.ejs", {url: req.url, errorMessage: err.message})
      });
    },
    getAddSong : function(req,res){
        res.render("addSong.ejs", {songData:null})
    },
    getEditSong : function(req,res){
      let artistRegex = new RegExp("^" + utils.unlinkify(req.params.artist) + "$", "gi");
      let titleRegex = new RegExp("^" + utils.unlinkify(req.params.title) + "$", "gi");
      SongModel.findOne({title: titleRegex, artist: artistRegex}).then(result => {
        res.render("addSong.ejs", {songData : result})
      }).catch(err => {
        res.render("error.ejs", {url: req.url, errorMessage: err.message});
      });
    },
}