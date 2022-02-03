const express = require("express");
const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const UserModel = require('../models/user');
const crypto = require('crypto');

router.get("/login", function(req, res) {
    res.render("login.ejs", {userData: req.user}) 
});  

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
}); 

router.get("/google", passport.authenticate("google", {
    scope: ["profile", 'email']
})); 

router.get("/google/redirect", passport.authenticate("google"), function(req, res) {
    res.redirect("/profile/"); 
});

router.get("/create-account", function(req, res) {
    res.render("createAccount.ejs", {userData: req.user, userEmail: null})
});

router.post("/create-account", urlencodedParser, function(req, res, next) {
    const salt = crypto.randomBytes(16).toString('hex');
    const {username, email, password} = req.body;
    UserModel.findOne({ email: email }, function (err, user) {
        if (err) { return next(err); }
        if (user) {
            return res.render("createAccount.ejs", {userData: req.user, userEmail: email})
        }
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            const newUser = new UserModel({
                username: username,
                email: email,
                hashedPassword: hashedPassword.toString('hex'),
                salt: salt
            });
            return newUser.save().then(()=>{
                next();
            });
        });
      });
}, passport.authenticate('local', { failureRedirect: '/create-account', successRedirect: "/profile/"}));

// router.post("/local", urlencodedParser, function(req, res, next){
//     passport.authenticate('local', function (error, user, info) {
//         console.log(req.body)
//         console.log(error);
//         console.log(user);
//         console.log(info);
//         req.body.passportError = error;
//         req.body.passportUser = user;
//         req.body.passportInfo = info;
//     })(req, res)
//     next();
// }, function(req, res){
//     console.log(req.body);
//     res.send(req.body)

// });

// router.post("/local", passport.authenticate("local", {
//     successRedirect: "/profile/",
//     failureRedirect: "/auth/login/"
//   }));

// app.post('/login', 
// passport.authenticate('local', { failureRedirect: '/login' }),
// function(req, res) {
// res.redirect('/');
// });



module.exports = router;