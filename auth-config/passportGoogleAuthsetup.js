const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const queries = require("../database/queries");
const { googleClientID, googleClientSecret, googleCallbackURL } = process.env;

passport.serializeUser((user, done) => {
    done(null, user._id ? user._id.toString() : user.id)
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
        const email = profile._json.email;
        // Never link on an unverified email claim (account-takeover vector).
        if (email && profile._json.email_verified === false) {
            return done(null, false, { message: "Google email not verified." });
        }
        // 1. Known Google identity → log in.
        const user = await queries.getGoogleUser(profile.id);
        if (user) {
            if (!user.email && email) {
                await queries.updateUser(user._id.toString(), { email: email });
            }
            return done(null, user);
        }
        // 2. Unknown Google identity but known email.
        const userEmailExists = await queries.findUserByEmail(email);
        if (userEmailExists) {
            const verified = profile._json.email_verified === true;
            const noConflict = !userEmailExists.googleId || userEmailExists.googleId === profile.id;
            // Best UX with a guardrail: auto-link ONLY when Google proves
            // inbox control (email_verified) and no conflicting googleId is
            // set. Anything else fails closed to /auth/login/?link=required.
            if (verified && noConflict) {
                const linkExtra = {
                    thumbnail: profile._json.picture,
                    email: email
                };
                if (!userEmailExists.username && profile.displayName) {
                    linkExtra.username = profile.displayName;
                }
                await queries.linkGoogleAccount(userEmailExists._id.toString(), profile.id, linkExtra);
                const linkedUser = await queries.findUserById(userEmailExists._id.toString());
                return done(null, linkedUser);
            }
            if (userEmailExists.salt) {
                return done(null, false, { message: "An account with this email already exists. Log in with your password first, then link Google from your profile." });
            }
            return done(null, false, { message: "This email is already linked to a different Google account." });
        }
        // 3. Brand new identity → create.
        const newUser = {
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture,
            email: email
        };
        await queries.createNewUser(newUser);
        const createdUser = await queries.findUserByEmail(email);
        return done(null, createdUser);
    })
);