module.exports = {
    index : async function(req, res){
        let makeSongUrl = `guitar-chords/add-song`;
        res.render("profile.ejs", {userData: req.user, makeSongUrl: makeSongUrl}); 
    }
}