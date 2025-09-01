const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const queries = require("../database/queries");
const { googleClientID, googleClientSecret, googleCallbackURL } = process.env;

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser(async (id, done) => {
    const user = await queries.findUserById(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy({
        //Options for google auth
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackURL,
    }, async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture,
            email: profile._json.email
        };
        const user = await queries.getGoogleUser(profile.id);
        const userEmailExists = await queries.findUserByEmail(profile._json.email);
        if (userEmailExists) {
            await queries.updateUser(userEmailExists._id, { email: profile._json.email, googleId: profile.id, thumbnail: profile._json.picture });
            return done(null, userEmailExists);
        }
        if (!user) {
            await queries.createNewUser(newUser);
            return done(null, newUser);
        }
        if (!user.email) {
            await queries.updateUser(user._id, { email: profile._json.email });
        }
        return done(null, user);
    })
);