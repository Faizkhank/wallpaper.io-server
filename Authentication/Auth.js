const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../Models/UserSchema");
const bcrypt = require("bcryptjs");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "https://api-wallpaper-io.onrender.com/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      // Register user here
      User.find({ GoogleID: profile.id }, async (err, user) => {
        if (user.length === 0) {
          try {
            const Usersave = new User({
              GoogleID: profile.id,
              displayName: profile.displayName,
              photos: profile.photos[0].value,
            });
            await Usersave.save();
          } catch (err) {}
        }
      });
      cb(null, profile);
    }
  )
);
passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result === true) {
          User.find({ GoogleID: user.GoogleID }, (err, data) => {
            const userlog = {
              displayName: data[0].displayName,
              photos: data[0].photos,
              id: data[0]._id,
              Totallikes: data[0].Totallikes,
              followers: data[0].followers,
              About: data[0].About,
            };
            return done(null, userlog);
          });
        } else {
          return done(null, false);
        }
      });
    });
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  console.log(user);
  User.find({ GoogleID: user }, (err, data) => {
    const userlog = {
      displayName: data[0].displayName,
      photos: data[0].photos,
      id: data[0]._id,
      Totallikes: data[0].Totallikes,
      followers: data[0].followers,
      About: data[0].About,
    };
    done(null, userlog);
  });
});
