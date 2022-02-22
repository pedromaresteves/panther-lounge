const UserModel = require("../models/user");
const crypto = require("crypto");

module.exports = {
    loginHome : function(req, res) {
        res.render("loginGeneral.ejs", {userData: req.user}) 
    },
    localLogin : function(req, res) {
        const failedLogin = req.query.login === 'failed';
        const loginError = req.session.messages ? req.session.messages[req.session.messages.length-1] : '';
        res.render("loginLocal.ejs", {userData: req.user, loginError: loginError, failedLogin: failedLogin}) 
    },
    logout : function(req, res) {
        req.logout();
        res.redirect("/");
    },
    getCreateAccount : function(req, res) {
        const fail = {
            failedLogin: req.query.creation === 'failed',
            failedMsg:"Email aldready registered."
        };
        res.render("createAccount.ejs", {userData: req.user, fail: fail})
    },
    postCreateAccount : function(req, res, next) {
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
    }
}