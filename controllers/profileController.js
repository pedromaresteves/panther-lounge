const songModel = require("../models/song");

module.exports = {
    index : function(req, res){
        let userSongs = [];
        songModel.find({ songCreator: req.user._id}).then(result => {
            console.log(result);
            result.forEach(function(item){
                userSongs.push(item.title)
            });
            return userSongs;
        }).then(result => {
            res.render("profile.ejs", {userData: req.user, userSongs: result}); 
        });     
    }
}