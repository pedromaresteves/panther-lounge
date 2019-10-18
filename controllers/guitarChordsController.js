const SongModel = require("../models/song");
const utils = require("../utils/utils");

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
              res.render("guitarChords.ejs", {userData: req.user, data: finalArray, numOfPages: numOfPages}); 
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
            res.render("artistPage.ejs", {userData: req.user, artist: finalArray[0].artist, data: finalArray, numOfPages: numOfPages, artistParam : utils.encodeChars(req.params.artist), recommended: {item : "Poop"}})
              }).catch(err => {
              res.render("error.ejs", {userData: req.user, url: req.url, errorMessage : err.message})
            }); 
          });
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