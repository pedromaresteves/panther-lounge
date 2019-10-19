const SongModel = require("../models/song");
const utils = require("../utils/utils");

module.exports = {
    paginationArtists : async function(req,res){
        const resultsPerPage = 3;
        let resultsToSkip = req.query.page-1;
        if(!resultsToSkip) resultsToSkip = 0;
        let results = await SongModel.aggregate([
            {$group:{_id : {name : "$artist", link: "$nArtist"}, total : { $sum: 1 }}},
            {$sort:{'_id.link' : 1}},
            {$skip : resultsToSkip*resultsPerPage},
            {$limit : 3}
            ]);
        let finalArray = [];
        results.forEach(function(item){
            finalArray.push({artist: item._id.name, nOfSongs: item.total, link: utils.encodeChars(item._id.link)})
          });
        let totalResults = await SongModel.aggregate([
            {$group:{_id : {name : "$artist", link: "$nArtist"}}},
            {$count:"numArtists"}]);
        const numOfPages = Math.ceil(totalResults[0].numArtists/resultsPerPage);
        return res.send(["paginationArtists", finalArray, numOfPages]);
    },
    paginationSongsByArtist : async function(req,res){
        const resultsPerPage = 3;
        let resultsToSkip = req.query.page-1;
        if(!resultsToSkip) resultsToSkip = 0;
        let results = await SongModel.aggregate([
          { $match: { nArtist: req.params.artist } },
          { $group:{_id : {name : "$artist", title: "$title", link: "$nTitle"}}},
          { $sort: { '_id.link' : 1 } },
          { $skip : resultsToSkip*resultsPerPage },
          {$limit : 3}
          ]);
        let finalArray = [];
        results.forEach(function(item){
            finalArray.push({artist: item._id.name, title: item._id.title, link: utils.encodeChars(item._id.link)})
        });
        let totalResults = await SongModel.aggregate([
            { $match: { nArtist: req.params.artist } },
            { $count:"numArtists"}]);
        const numOfPages = Math.ceil(totalResults[0].numArtists/resultsPerPage);
        return res.send(["paginationSongsByArtist", finalArray, utils.encodeChars(req.params.artist), numOfPages]);
    },
    profileSongs : async function(req, res){
        let userSongs = [];
        const resultsPerPage = 3;
        let resultsToSkip = req.query.page-1;
        if(!resultsToSkip) resultsToSkip = 0;
        const songsToShow = await SongModel.aggregate([
            { $match: { songCreator: req.user._id.toString()} },
            { $sort: { nTitle : 1} },
            { $skip: resultsToSkip*resultsPerPage },
            { $limit : resultsPerPage}
        ]);
        songsToShow.forEach(function(item){
            userSongs.push(
                {
                artist: item.artist,
                title: item.title,
                artistLink: utils.encodeChars(item.nArtist),
                songLink: utils.encodeChars(item.nTitle)
                }                    
            );
        });
        res.send([userSongs]); 
    },
    addSong : function(req,res){
        const newSong = new SongModel({
          artist: req.body.artist,
          title: req.body.title,
          lyricsChords: req.body.lyricsAndChords,
          nArtist: req.body.artist.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
          nTitle: req.body.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
          songCreator: req.user._id
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
    deleteSong : function(req, res){
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
    getAllResults : function(req, res){
        SongModel.find({}).sort( { nArtist: 1 } ).then(result => {
            result.forEach(function(item){
                item.nArtist = utils.encodeChars(item.nArtist)
                item.nTitle = utils.encodeChars(item.nTitle)
            });
            res.send(result)
        });
    }
}