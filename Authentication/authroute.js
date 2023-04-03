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
  console.log(req.session);
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
Router.post("/user/login", passport.authenticate("local"), (req, res) => {
  if (req.session) {
    res.send(true);
  } else {
    res.send(false);
  }
});
Router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, async (err, user) => {
    if (!user) {
      const randomNum = generateRandomNumber();
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        GoogleID: randomNum,
        displayName: req.body.username,
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
