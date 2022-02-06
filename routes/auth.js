const express = require("express");
const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const UserModel = require("../models/user");
const crypto = require("crypto");

router.get("/login", function(req, res) {
    res.render("loginGeneral.ejs", {userData: req.user}) 
});  

router.get("/login-local/", function(req, res) {
    const failedLogin = req.query.login === 'failed'
    const loginError = req.session.messages[req.session.messages.length-1];
    res.render("loginLocal.ejs", {userData: req.user, loginError: loginError, failedLogin: failedLogin}) 
});  

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
}); 

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
})); 

router.get("/google/redirect", passport.authenticate("google"), function(req, res) {
    res.redirect("/profile/"); 
});

router.get("/create-account", function(req, res) {
    const fail = {
        failedLogin: req.query.creation === 'failed',
        failedMsg:"Email aldready registered."
    };
    res.render("createAccount.ejs", {userData: req.user, fail: fail})
});

router.post("/create-account", urlencodedParser, function(req, res, next) {
    const salt = crypto.randomBytes(16).toString("hex");
    const {username, email, password} = req.body;
    UserModel.findOne({ email: email }, function (err, user) {
        if (err) { return next(err); }
        if (user) {
            return res.redirect("create-account/?creation=failed");
        }
        crypto.pbkdf2(password, salt, 310000, 32, "sha256", function(err, hashedPassword) {
            const newUser = new UserModel({
                username: username,
                email: email,
                hashedPassword: hashedPassword.toString("hex"),
                salt: salt
            });
            return newUser.save().then(()=>{
                next();
            });
        });
      });
}, passport.authenticate("local", { failureRedirect: "/create-account", successRedirect: "/profile/"}));

router.post("/local", urlencodedParser, passport.authenticate("local", {
    successRedirect: "/profile/",
    failureRedirect: "/auth/login-local/?login=failed",
    failureMessage: true
  }));


module.exports = router;