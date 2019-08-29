module.exports = {
    index : function(req, res){
        console.log("Fuck my ass", req.user);
        res.render("profile.ejs", {userData: req.user}); 
    }
}