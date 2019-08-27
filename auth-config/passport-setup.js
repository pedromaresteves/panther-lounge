const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const stuff = require('../stuff');

passport.use(
    new GoogleStrategy({
        //Options for google auth
        clientID: stuff.google.clientID,
        clientSecret: stuff.google.clientSecret,
        callbackURL: stuff.google.callbackURL,
    }, (accessToken, refreshToken, profile, done)=>{
        console.log("POOP")
        //Passport Callback function
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            console.log(`Access Token:" ${accessToken}, Refresh Token:" ${refreshToken}`);
            return done(err, user);
          });
    })
);