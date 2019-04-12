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
        {$group:{_id : {name : "$artist", link: "$nArtist"}, total : { $sum: 1 }}},
        {$sort:{'_id.lowerName' : 1}}
        ]).then(result=>{
          let finalArray = [];
          result.forEach(function(item){
            finalArray.push({artist: item._id.name, nOfSongs: item.total, link: utils.encodeChars(item._id.link)})
          });
          res.render("guitarChords.ejs", {data: finalArray}); 
        });
    },
    artistList : function(req, res){ //SONGS ACCORDING TO ARTIST
      SongModel.find({nArtist:req.params.artist}).then(result => {
        let artistName = result[0].artist; //Every result will have the same artistname, I just get the first.
        let songsAndLinks = [];
        let generateSongLink;
        for(let i = 0; i < result.length; i++){
          generateSongLink = result[i].nTitle;
          songsAndLinks.push({title : result[i].title, link : utils.encodeChars(generateSongLink)})
        }
        res.render("artistPage.ejs", {artist: artistName, data: songsAndLinks, artistParam : utils.encodeChars(req.params.artist), recommended: {item : "Poop"}})
      }).catch(err => {
        res.render("error.ejs", {url: req.url, errorMessage : err.message})
      });
    },
    song : function(req,res){ //Get song from DB and Paint it
      let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
      let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
      SongModel.findOne({nTitle: titleRegex, nArtist: artistRegex}).then(result => {
        const lyricsChords = JSON.parse(result.lyricsChords).ops;
        res.render("songs.ejs", {artist: result.artist, title: result.title, songCreater: result.songCreater, song: lyricsChords});
      }).catch(err => {
        res.render("error.ejs", {url: req.url, errorMessage: err.message})
      });
    },
    getAddSong : function(req,res){
      res.render("addSong.ejs", {songData:{artist:req.params.artist}})
    },
    getEditSong : function(req,res){
      let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
      let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
      SongModel.findOne({title: titleRegex, artist: artistRegex}).then(result => {
        res.render("addSong.ejs", {songData : result})
      }).catch(err => {
        res.render("error.ejs", {url: req.url, errorMessage: err.message});
      });
    },
}