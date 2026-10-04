const passport = require("passport");
const LocalStrategy = require("passport-local");
const queries = require("../database/queries");
const crypto = require("crypto");
const { Buffer } = require("buffer");

passport.serializeUser((user, done) => {
  done(null, user._id ? user._id.toString() : user.id)
});

passport.deserializeUser(async (id, done) => {
  const user = await queries.findUserById(id);
  done(null, user);
});

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
},
  async function (email, password, done) {
    const user = await queries.findUserByEmail(email);
    if (!user) { return done(null, false, { message: "User not found." }); }
    if (!user.salt) {
      // Google-only account: fail closed. Setting a password from an
      // unauthenticated request would let anyone who knows the email take
      // over the account. There is deliberately no password flow for these
      // accounts — Google-only users log in with Google, period.
      return done(null, false, { message: "This account uses Google login. Please log in with Google." });
    }
    crypto.pbkdf2(password, user.salt, 310000, 32, "sha256", function (err, hashedPassword) {
      if (err) { return done(err); }
      const bufferedUserHashedPwd = Buffer.from(user.hashedPassword);
      const bufferedIntroducedPwd = Buffer.from(hashedPassword.toString("hex"));
      // timingSafeEqual throws on length mismatch (corrupt/short hash) —
      // treat as failed login, not a 500.
      if (bufferedUserHashedPwd.length !== bufferedIntroducedPwd.length) {
        return done(null, false, { message: "Incorrect username or password." });
      }
      if (!crypto.timingSafeEqual(bufferedUserHashedPwd, bufferedIntroducedPwd)) {
        return done(null, false, { message: "Incorrect username or password." });
      }
      return done(null, user);
    });
  }
));
