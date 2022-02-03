const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const UserModel = require('../models/user')
const {googleClientID, googleClientSecret, googleCallbackURL} = require('../stuff');

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
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackURL,
    }, (accessToken, refreshToken, profile, done)=>{
        //Passport Callback function
        UserModel.findOne({ googleId: profile.id }, function (err, user) {
            const newUser = new UserModel({
                username: profile.displayName,
                googleId: profile.id,
                thumbnail: profile._json.picture,
                email: profile._json.email
            });
            if(!user) {
                return newUser.save().then((newUser)=>{
                    done(null, newUser);
                });
            }
            if(!user.email) {
                return user.updateOne({ email: profile._json.email }).then(()=>{
                    done(null, user);
                })
            }
            return done(null, user);
        });
    })
);