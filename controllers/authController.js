const crypto = require("crypto");
const util = require("util");
const queries = require("../database/queries");

const pbkdf2Async = util.promisify(crypto.pbkdf2);

module.exports = {
    loginHome: (req, res) => {
        res.render("loginGeneral.ejs", { userData: req.user })
    },
    localLogin: (req, res) => {
        const failedLogin = req.query.login === 'failed';
        const loginError = req.session.messages ? req.session.messages[req.session.messages.length - 1] : '';
        res.render("loginLocal.ejs", { userData: req.user, loginError: loginError, failedLogin: failedLogin })
    },
    logout: (req, res) => {
        req.logout((err) => {
            if (err) return res.status(500).send('Logout failed');
            res.redirect("/");
        });
    },
    getCreateAccount: (req, res) => {
        const fail = {
            failedLogin: req.query.creation === 'failed',
            failedMsg: req.query.creation === 'failed' ? "Email already registered." : ''
        };
        res.render("createAccount.ejs", { userData: req.user, fail: fail })
    },
    postCreateAccount: async (req, res, next) => {
        try {
            const salt = crypto.randomBytes(16).toString("hex");
            const { username, email, password } = req.body;
            const user = await queries.findUserByEmail(email);
            if (user) {
                return res.redirect("create-account/?creation=failed");
            }
            const hashedPassword = await pbkdf2Async(password, salt, 310000, 32, "sha256");
            const newUser = {
                username: username,
                email: email,
                hashedPassword: hashedPassword.toString("hex"),
                salt: salt
            }
            await queries.createNewUser(newUser);
            return next();
        } catch (err) {
            return next(err);
        }
    }
}