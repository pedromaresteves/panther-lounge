const crypto = require("crypto");
const queries = require("../database/queries");

module.exports = {
    loginHome: function (req, res) {
        res.render("loginGeneral.ejs", { userData: req.user })
    },
    localLogin: function (req, res) {
        const failedLogin = req.query.login === 'failed';
        const loginError = req.session.messages ? req.session.messages[req.session.messages.length - 1] : '';
        res.render("loginLocal.ejs", { userData: req.user, loginError: loginError, failedLogin: failedLogin })
    },
    logout: function (req, res) {
        req.logout();
        res.redirect("/");
    },
    getCreateAccount: function (req, res) {
        const fail = {
            failedLogin: req.query.creation === 'failed',
            failedMsg: "Email aldready registered."
        };
        res.render("createAccount.ejs", { userData: req.user, fail: fail })
    },
    postCreateAccount: async function (req, res, next) {
        const salt = crypto.randomBytes(16).toString("hex");
        const { username, email, password } = req.body;
        const user = await queries.findUserByEmail(email);
        if (user) {
            return res.redirect("create-account/?creation=failed");
        }
        crypto.pbkdf2(password, salt, 310000, 32, "sha256", async function (err, hashedPassword) {
            if (err) { return next(err); }
            const newUser = {
                username: username,
                email: email,
                hashedPassword: hashedPassword.toString("hex"),
                salt: salt
            }
            await queries.createNewUser(newUser);
            return next();
        });
    }
}