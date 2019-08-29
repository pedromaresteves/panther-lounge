const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const stuff = require('../stuff');
const UserModel = require('../models/user')

passport.serializeUser((user,done) => {
    done(null, user.id)
});

passport.deserializeUser((id,done) => {
    UserModel.findById(id).then((result)=>{
        done(null, result)
    });
});

passport.use(
    new GoogleStrategy({
        //Options for google auth
        clientID: stuff.google.clientID,
        clientSecret: stuff.google.clientSecret,
        callbackURL: stuff.google.callbackURL,
    }, (accessToken, refreshToken, profile, done)=>{
        //Passport Callback function
        UserModel.findOne({ googleId: profile.id }, function (err, user) {
            const newUser = new UserModel({
                username: profile.displayName,
                googleId: profile.id,
                thumbnail: profile._json.picture
            });
            if(!user) {
                newUser.save().then((newUser)=>{
                    return done(null, newUser)
                });
            }
            return done(null, user)
        });
    })
);