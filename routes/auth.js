var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const passport = require('passport');

router.get("/login", function(req, res) {
    res.render("login.ejs", {userData: req.user}) 
});  

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect('/');
}); 

router.get("/google", passport.authenticate('google', {
    scope: ['profile']
})); 

router.get("/google/redirect", passport.authenticate('google'), function(req, res) {
    res.redirect('/profile/'); 
}); 

module.exports = router;