const Router = require("express").Router();
const passport = require("passport");
const User = require("../Models/UserSchema");
const bcrypt = require("bcryptjs");

function generateRandomNumber() {
  const min = 10000000000000000000;
  const max = 99999999999999999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const CLIENT_URL = "https://wallpaper-weld.vercel.app";
Router.get("/login/success", (req, res) => {
  console.log(req.isAuthenticated());
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  }
});

Router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

Router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

Router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
Router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: CLIENT_URL,
  })
);
Router.post("/user/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.json({
        success: false,
        message: "An error occurred during authentication",
      });
    }
    if (!user) {
      return res.json({
        success: false,
        message: info && info.message ? info.message : "Authentication failed",
      });
    }
    // Authentication successful
    req.logIn(user, (err) => {
      if (err) {
        return res.json({
          success: false,
          message: "An error occurred during login",
        });
      }
      req.session.save((err) => {
        if (err) {
          return res.json({
            success: false,
            message: "An error occurred while saving session",
          });
        }
        return res
          .cookie("session", req.session.id, {
            maxAge: 86400000, // Set the maxAge to your desired session expiration time
            httpOnly: true,
            secure: false, // Set secure to true if using HTTPS
          })
          .json({
            success: true,
            message: "Authentication successful",
            user: user,
          });
      });
    });
  })(req, res, next);
});
Router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, async (err, user) => {
    if (!user) {
      const randomNum = generateRandomNumber();
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.first_name,
        email: req.body.email,
        GoogleID: randomNum,
        displayName: req.body.first_name + " " + req.body.last_name,
        password: hashedPassword,
      });
      await newUser.save();
      res.send(true);
    } else {
      res.send("user already exist");
    }
  });
});
module.exports = Router;
