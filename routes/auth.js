var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const passport = require('passport');

router.get("/login", function(req, res) {
    res.render("login2.ejs") 
});  

router.get("/logout", function(req, res) {
    res.sned("Poo choo") 
}); 

router.get("/google", passport.authenticate('google', {
    scope: ['openid profile']
})); 

router.get("/google/redirect", passport.authenticate('google'), function(req, res) {
    res.send("login with google") 
}); 

module.exports = router;