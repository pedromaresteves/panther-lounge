const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const UserModel = require('../models/user')

passport.serializeUser((user,done) => {
    done(null, user.id)
});

passport.deserializeUser((id,done) => {
    UserModel.findById(id).then((result)=>{
        done(null, result)
    });
});
console.log(process.env.googleCallbackURL, "Drunk Dickhead");
passport.use(
    new GoogleStrategy({
        //Options for google auth
        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret,
        callbackURL: process.env.googleCallbackURL,
    }, (accessToken, refreshToken, profile, done)=>{
        //Passport Callback function
        UserModel.findOne({ googleId: profile.id }, function (err, user) {
            const newUser = new UserModel({
                username: profile.displayName,
                googleId: profile.id,
                thumbnail: profile._json.picture
            });
            if(!user) {
                return newUser.save().then((newUser)=>{
                    done(null, newUser);
                });
            }
            return done(null, user);
        });
    })
);