const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const stuff = require('../stuff');
const UserModel = require('../models/user')

passport.serializeUser((user,done) => {
    console.log("serialize", user._id, user.id)
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
            });
            if(user.length < 1) {
                newUser.save().then((newUser)=>{
                    console.log(`New user created: ${newUser}.`);
                    done(null, newUser)
                });
            }
            console.log(`User already created: ${user} Fuck ass`);
            done(null, user)
        });
    })
);