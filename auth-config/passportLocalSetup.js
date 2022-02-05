const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("../models/user");
const crypto = require("crypto");
const {Buffer} = require("buffer");

passport.serializeUser((user,done) => {
    console.log("SERIALIZE")
    done(null, user.id)
});

passport.deserializeUser((id,done) => {
    console.log("DESERIALIZE")
    UserModel.findById(id).then((result)=>{
        done(null, result)
    });
});

  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  },
    function(email, password, done) {
      UserModel.findOne({ email: email }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: "User not found." }); }
        if(!user.salt) {return done(null, false, { message: "You've registered through a different login method" }); }
        crypto.pbkdf2(password, user.salt, 310000, 32, "sha256", function(err, hashedPassword) {
          if (err) { return done(err); }
          const bufferedUserHashedPwd = Buffer.from(user.hashedPassword);
          const bufferedIntroducedPwd = Buffer.from(hashedPassword.toString("hex"));
          if (!crypto.timingSafeEqual(bufferedUserHashedPwd, bufferedIntroducedPwd)) {
            return done(null, false, { message: "Incorrect username or password." });
          }
          return done(null, user);
        });
      });
    }
  ));
