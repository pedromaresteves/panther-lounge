require('dotenv').config();
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const guitarChordsRouter = require("./routes/guitarChords");
const profileRouter = require("./routes/profile");
const apiRouter = require("./routes/api");
const app = express();
const passport = require("passport");
require("./auth-config/passportGoogleAuthsetup");
require("./auth-config/passportLocalSetup");
const cookieSession = require("cookie-session");
const utils = require("./utils/utils");
const { PORT, sessionCookieKey } = process.env;

app.use(express.json())

//set up EJS layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');

//set up cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [sessionCookieKey],
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//set up template engine
app.set("view engine", "ejs");

//static files
app.use(express.static("./public"));

//fire routers
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/guitar-chords", guitarChordsRouter);

//fire API router
app.use("/api", apiRouter);

// catch 404 and forward to error handler (include method + path so the
// log tells you WHAT was requested, not just that something failed)
app.use(function (req, res, next) {
  var err = new Error(`Not Found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

// helpful error handler: one-line server log + friendly user-facing page.
// API/AJAX callers get JSON, browsers get the existing error.ejs view.
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  console.error(`${req.method} ${req.originalUrl} → ${status} ${err.message}`);
  res.status(status);
  if (req.path.startsWith("/api/")) {
    return res.json({ error: status === 404 ? "Not Found" : "Internal Server Error", path: req.originalUrl });
  }
  return utils.renderError(res, req, err);
});


//listen port
app.listen(PORT);
console.log(`You are listening to port ${PORT}`);
