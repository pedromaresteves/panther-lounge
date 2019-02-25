var express = require('express');
var router = express.Router();

router.get("/", function(req, res) {
    res.render("home.ejs", {data: "poop"}) 
});  
// app.get("/philosophies", function(req, res) {
//     res.render("philosophies.ejs", {data: "poop"}) 
// });  
// app.get("/videos", function(req, res) {
//     res.render("videos.ejs", {data: "poop"}) 
// });  
// app.get("/songs", function(req, res) {
//     res.render("songs.ejs", {data: "poop"}) 
//});  

module.exports = router;