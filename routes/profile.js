var express = require('express');
var router = express.Router();
var profileController = require("../controllers/profileController");

const authCheck = (req,res,next) => {
    if(!req.user){
        return res.redirect("/auth/login/")
    }
    return next();
}

router.get("/", authCheck, profileController.index);  


module.exports = router;