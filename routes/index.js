var express = require('express');
var router = express.Router();

router.get("/", function(req, res) {
    res.render("home.ejs", {userData: req.user}) 
});  

module.exports = router;