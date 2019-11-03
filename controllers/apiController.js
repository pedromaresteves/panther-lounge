const SongModel = require("../models/song");
const utils = require("../utils/utils");
const resultsPerPage = 10;

module.exports = {
    paginationArtists : async function(req,res){
        let data = {
            name: 'paginationArtists',
            visibleResults: [],
            currentPage: req.query.page,
            numOfPages: 1
        };
        let resultsToSkip = req.query.page-1;
        if(!resultsToSkip) resultsToSkip = 0;
        const results = await SongModel.aggregate([
            {$group:{_id : {name : "$artist", link: "$nArtist"}, total : { $sum: 1 }}},
            {$sort:{'_id.link' : 1}},
            {$skip : resultsToSkip*resultsPerPage},
            {$limit : 3}
            ]);
        results.forEach(function(item){
            data.visibleResults.push({artist: item._id.name, nOfSongs: item.total, artistPath: utils.encodeChars(item._id.link)});
        });
        let totalResults = await SongModel.aggregate([
        {$group:{_id : {name : "$artist", link: "$nArtist"}}},
        {$count:"numArtists"}]);
        data.numOfPages = Math.ceil(totalResults[0].numArtists/resultsPerPage);
        return res.send(data);
    },
    paginationSongsByArtist : async function(req,res){
        let data = {
            name: 'paginationSongsByArtist',
            visibleResults: [],
            artistPath: utils.encodeChars(req.params.artist),
            currentPage: req.query.page,
            numOfPages: 1
        };
        let resultsToSkip = req.query.page-1;
        if(!resultsToSkip) resultsToSkip = 0;
        let results = await SongModel.aggregate([
          { $match: { nArtist: req.params.artist } },
          { $group:{_id : {name : "$artist", title: "$title", songPath: "$nTitle"}}},
          { $sort: { '_id.link' : 1 } },
          { $skip : resultsToSkip*resultsPerPage },
          {$limit : 3}
          ]);
        results.forEach(function(item){
            data.visibleResults.push({artist: item._id.name, title: item._id.title, songPath: utils.encodeChars(item._id.songPath)})
        });
        let totalResults = await SongModel.aggregate([
            { $match: { nArtist: req.params.artist } },
            { $count:"numArtists"}]);
        data.numOfPages = Math.ceil(totalResults[0].numArtists/resultsPerPage);
        return res.send(data);
    },
    profileSongs : async function(req, res){
        let data = {
            name: 'profileSongs',
            visibleResults: [],
            currentPage: req.query.page,
            numOfPages: 1
        };
        let resultsToSkip = req.query.page-1;
        if(!resultsToSkip) resultsToSkip = 0;
        const songsToShow = await SongModel.aggregate([
            { $match: { songCreator: req.user._id.toString()} },
            { $sort: { nTitle : 1} },
            { $skip: resultsToSkip*resultsPerPage },
            { $limit : resultsPerPage}
        ]);
        songsToShow.forEach(function(item){
            data.visibleResults.push(
                {
                artist: item.artist,
                title: item.title,
                artistPath: utils.encodeChars(item.nArtist),
                songPath: utils.encodeChars(item.nTitle)
                }                    
            );
        });
        const totalUserSongs = await SongModel.aggregate([
            { $match: { songCreator: req.user._id.toString() } },
            { $count:"numSongs"}]);
        if(totalUserSongs[0]){
            data.numOfPages = Math.ceil(totalUserSongs[0].numSongs/resultsPerPage);
        }
        res.send(data); 
    },
    getLyricsNchords: async function(req, res){
        let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
        let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
        SongModel.findOne({nTitle: titleRegex, nArtist: artistRegex}).then(result => {
          if(!result.songCreator) result.songCreator = "Temp User"
          res.send(result);
        });
    },
    addSong : function(req,res){
        const data = {
            redirectUrl: '',
            errorMsg: ''
        };
        if(!req.user){
            data.errorMsg = 'You gotta be logged if you wanna add songs.'
            return res.send(data);
        }
        const newSong = new SongModel({
          artist: utils.capitalizeName(req.body.artist),
          title: req.body.title,
          lyricsChords: req.body.lyricsAndChords,
          nArtist: req.body.artist.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
          nTitle: req.body.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
          songCreator: req.user._id
        });
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
            { $set: {lyricsChords: newSong.lyricsChords, title: newSong.title, nTitle: newSong.nTitle}}).then(result => {
            return res.send(data);
        });
    },
    deleteSong : function(req, res){
        let artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
        let titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
        const data = {
            deletedMsg: "The song was deleted. Bye bye! :("
        };
        SongModel.findOneAndDelete({nArtist: artistRegex, nTitle: titleRegex}).then(result => {
            return SongModel.findOne({artist: artistRegex});
        }).then(result =>{
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