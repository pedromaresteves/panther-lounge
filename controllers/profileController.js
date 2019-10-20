const SongModel = require("../models/song");
const utils = require("../utils/utils");

module.exports = {
    index : async function(req, res){
        // let userSongs = [];
        // const resultsPerPage = 3;
        // let resultsToSkip = req.query.page-1;
        // let numOfPages;
        // if(!resultsToSkip) resultsToSkip = 0;
        // const totalUserSongs = await SongModel.aggregate([
        //     { $match: { songCreator: req.user._id.toString() } },
        //     { $count:"numSongs"}]);
        // const songsToShow = await SongModel.aggregate([
        //     { $match: { songCreator: req.user._id.toString()} },
        //     { $sort: { nTitle : 1} },
        //     { $skip: resultsToSkip*resultsPerPage },
        //     { $limit : resultsPerPage}
        // ]);
        // numOfPages = Math.ceil(totalUserSongs[0].numSongs/resultsPerPage);
        // songsToShow.forEach(function(item){
        //     userSongs.push(
        //         {
        //             artist: item.artist,
        //             title: item.title,
        //             artistLink: utils.encodeChars(item.nArtist),
        //             songLink: utils.encodeChars(item.nTitle)
        //         }                    
        //     );
        // });
        res.render("profile.ejs", {userData: req.user}); 
    }
}