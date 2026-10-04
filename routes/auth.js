const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

// Use express built-in parser for urlencoded bodies where needed
router.use(express.urlencoded({ extended: false }));

const authCheck = (req, res, next) => {
    if (req.user) return res.redirect("/profile/");
    return next();
};

router.get("/login", authCheck, authController.loginHome);
router.get("/login-local", authCheck, authController.localLogin);
router.get("/logout", authController.logout);

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/google/redirect",
    passport.authenticate("google", { failureRedirect: "/auth/login/?link=required" }),
    function (req, res) {
        res.redirect("/profile/");
    }
);

router.get("/create-account", authCheck, authController.getCreateAccount);

router.post(
    "/create-account",
    authController.postCreateAccount,
    passport.authenticate("local", { failureRedirect: "/create-account", successRedirect: "/profile/" })
);

router.post(
    "/local",
    passport.authenticate("local", {
        successRedirect: "/profile/",
        failureRedirect: "/auth/login-local/?login=failed",
        failureMessage: true,
    })
);

// Add a local password to the currently logged-in Google account.
// Guarded by session ownership inside authController.linkLocal.
// NOTE: not yet exposed in any UX (no form calls this) — next step is an
// "Add a password" form on profile.ejs for salt-less users. Keep the
// login-failure message honest until that lands.
router.post(
    "/link-local",
    express.json(),
    authController.linkLocal
);

module.exports = router;