const express = require("express");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const guitarChordsRouter = require("./routes/guitarChords");
const apiRouter = require("./routes/api");
const stuff = require("./stuff.js");
const mongoose = require('mongoose');
const app = express();
const passportSetup = require('./auth-config/passport-setup')

mongoose.connect(stuff.pantherLoungeDBConnection, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB Connection Started");
});

//set up template engine
app.set("view engine", "ejs");

//static files
app.use(express.static("./public"));

//fire routers
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/guitar-chords', guitarChordsRouter);

//fire API router
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};
// render the error page
res.status(err.status || 500);
res.render('error.ejs', {errorMessage: res.locals.message, url:"http://127.0.0.1:3000" + req.originalUrl});
});

//listen port
app.listen(3000);
console.log("You are listening to port 3000");
