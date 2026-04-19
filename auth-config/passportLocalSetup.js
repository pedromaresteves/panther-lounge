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
      const salt = crypto.randomBytes(16).toString("hex");
      crypto.pbkdf2(password, salt, 310000, 32, "sha256", async function (err, hashedPassword) {
        if (err) { return done(err); }
        await queries.linkLocalAccount(user._id, salt, hashedPassword.toString("hex"));
        const updatedUser = await queries.findUserById(user._id);
        return done(null, updatedUser);
      });
      return;
    }
    crypto.pbkdf2(password, user.salt, 310000, 32, "sha256", function (err, hashedPassword) {
      if (err) { return done(err); }
      const bufferedUserHashedPwd = Buffer.from(user.hashedPassword);
      const bufferedIntroducedPwd = Buffer.from(hashedPassword.toString("hex"));
      if (!crypto.timingSafeEqual(bufferedUserHashedPwd, bufferedIntroducedPwd)) {
        return done(null, false, { message: "Incorrect username or password." });
      }
      return done(null, user);
    });
  }
));
