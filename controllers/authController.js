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
        try {
            req.logout();
        } catch (e) {
            console.error("req.logout error:", e);
        }
        req.session = null;
        res.clearCookie('connect.sid');
        res.redirect("/");
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
    },
    // Add a local password to the currently logged-in (Google) account.
    // Requires authentication — ownership comes from the session, never
    // from a request-supplied id. Rejects if a password already exists.
    // NOTE: no UX calls this yet (needs an "Add a password" form on
    // profile.ejs for salt-less users) — do not advertise it in
    // user-facing messages until then.
    linkLocal: async (req, res, next) => {
        try {
            if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
                return res.status(401).json({ error: "Login required." });
            }
            const password = req.body && req.body.password;
            if (typeof password !== "string" || password.length < 8) {
                return res.status(400).json({ error: "Password must be at least 8 characters." });
            }
            const userId = req.user._id.toString();
            const user = await queries.findUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }
            if (user.salt) {
                return res.status(409).json({ error: "Account already has a password." });
            }
            const salt = crypto.randomBytes(16).toString("hex");
            const hashedPassword = await pbkdf2Async(password, salt, 310000, 32, "sha256");
            await queries.linkLocalAccount(userId, salt, hashedPassword.toString("hex"));
            return res.status(200).json({ ok: true });
        } catch (err) {
            return next(err);
        }
    }
}