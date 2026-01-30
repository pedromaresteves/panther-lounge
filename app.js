const express = require("express");
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
const { PORT, sessionCookieKey } = process.env;

app.use(express.json())

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});


//listen port
app.listen(PORT);
console.log(`You are listening to port ${PORT}`);
