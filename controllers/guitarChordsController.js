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
      const resultsPerPage = 3;
      let resultsToSkip = req.query.page-1;
      if(!resultsToSkip) resultsToSkip = 0;
      SongModel.aggregate([
        {$group:{_id : {name : "$artist", link: "$nArtist"}, total : { $sum: 1 }}},
        {$sort:{'_id.link' : 1}},
        {$skip : resultsToSkip*resultsPerPage},
        {$limit : resultsPerPage}
        ]).then(result=>{
          let finalArray = [];
          result.forEach(function(item){
            finalArray.push({artist: item._id.name, nOfSongs: item.total, link: utils.encodeChars(item._id.link)})
          });
          SongModel.aggregate([
            {$group:{_id : {name : "$artist", link: "$nArtist"}}},
            {$count:"numArtists"}]).then(result=>{
              const numOfPages = Math.ceil(result[0].numArtists/resultsPerPage);
              res.render("guitarChords.ejs", {data: finalArray, numOfPages: numOfPages}); 
            })
        });
    },
    artistList : function(req, res){ //SONGS ACCORDING TO ARTIST
      const resultsPerPage = 3;
      let resultsToSkip = req.query.page-1;
      if(!resultsToSkip) resultsToSkip = 0;
      SongModel.aggregate([
        { $match: { nArtist: req.params.artist } },
        { $group:{_id : {name : "$artist", title: "$title", link: "$nTitle"}}},
        { $sort: { '_id.link' : 1 } },
        { $skip : resultsToSkip*resultsPerPage },
        {$limit : 3}
        ]).then(result => {
        let finalArray = [];
        result.forEach(function(item){
          finalArray.push({artist: item._id.name, title: item._id.title, link: utils.encodeChars(item._id.link)})
        });
        SongModel.aggregate([
          { $match: { nArtist: req.params.artist } },
          { $count:"numArtists"}]).then(result=>{
            const numOfPages = Math.ceil(result[0].numArtists/resultsPerPage);
            res.render("artistPage.ejs", {artist: finalArray[0].artist, data: finalArray, numOfPages: numOfPages, artistParam : utils.encodeChars(req.params.artist), recommended: {item : "Poop"}})
              }).catch(err => {
              res.render("error.ejs", {url: req.url, errorMessage : err.message})
            }); 
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