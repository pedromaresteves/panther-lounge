module.exports = {
    index : function(req, res){
        res.render("profile.ejs", {userData: req.user, userSongs: "poo"}); 
    }
}