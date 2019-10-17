const songModel = require("../models/song");
const utils = require("../utils/utils");

module.exports = {
    index : function(req, res){
        let userSongs = [];
        //CHANGE FIND TO AGGREGATE, GET IMPORTANT INFO, SORT AND LIMIT RESULTS
        songModel.find({ songCreator: req.user._id}).then(result => {
            result.forEach(function(item){
                userSongs.push(
                    {
                        artist: item.artist,
                        title: item.title,
                        artistLink: utils.encodeChars(item.nArtist),
                        songLink: utils.encodeChars(item.nTitle)
                    }                    
                )});
            return userSongs;
        }).then(result => {
            res.render("profile.ejs", {userData: req.user, userSongs: result}); 
        });    
        const resultsPerPage = 3;
        let resultsToSkip = req.query.page-1;
        if(!resultsToSkip) resultsToSkip = 0;
/*         SongModel.aggregate([
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
                res.render("index.ejs", {userData: req.user, data: finalArray, numOfPages: numOfPages}); 
              })
          }); */
    }
}