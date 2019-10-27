module.exports = {
    index : async function(req, res){
        res.render("profile.ejs", {userData: req.user}); 
    }
}