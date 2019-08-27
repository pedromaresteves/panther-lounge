const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const stuff = require('../stuff');
const UserModel = require('../models/user')

passport.use(
    new GoogleStrategy({
        //Options for google auth
        clientID: stuff.google.clientID,
        clientSecret: stuff.google.clientSecret,
        callbackURL: stuff.google.callbackURL,
    }, (accessToken, refreshToken, profile, done)=>{
        //Passport Callback function
        UserModel.find({ googleId: profile.id }, function (err, user) {
            const newUser = new UserModel({
                username: profile.displayName,
                googleId: profile.id,
            });
            if(user.length < 1) {
                newUser.save().then((newUser)=>{
                    console.log(`New user created: ${newUser}.`);
                });
            }
            console.log(`User already created: ${user}`);
            return done(err, user);
        });
    })
);