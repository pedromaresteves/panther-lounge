const express = require("express");
const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");
const authController = require("../controllers/authController");
const urlencodedParser = bodyParser.urlencoded({ extended: false });


const authCheck = (req,res,next) => {
    if(req.user){
        return res.redirect("/profile/")
    }
    return next();
}

router.get("/login", authCheck, authController.loginHome);  

router.get("/login-local", authCheck, authController.localLogin);  

router.get("/logout", authController.logout); 

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
})); 

router.get("/google/redirect", passport.authenticate("google"), function(req, res) {
    res.redirect("/profile/"); 
});

router.get("/create-account", authCheck, authController.getCreateAccount);

router.post("/create-account", urlencodedParser, authController.postCreateAccount,
    passport.authenticate("local", { failureRedirect: "/create-account", successRedirect: "/profile/"}));

router.post("/local", urlencodedParser, passport.authenticate("local", {
    successRedirect: "/profile/",
    failureRedirect: "/auth/login-local/?login=failed",
    failureMessage: true
  }));


module.exports = router;