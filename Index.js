const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const Upload = require("./Upload");
const Like = require("./Like");
const app = express();
const passport = require("passport");
const authRoute = require("./Authentication/authroute");
const passportSetup = require("./Authentication/Auth");
const User = require("./Models/UserSchema");
const getdata = require("./Getdata");
const search = require("./search");
const Updates = require("./Updates/Updates");
const Imagegen = require("./AI/image_generation");
const API = require("./Authentication/apiverify"); // not using right now
const follow = require("./follow");
const cors = require("cors");
app.use(express.static("uploads"));
app.use(express.json());

app.use(express.urlencoded({ extended: false, limit: "2gb" }));
app.use(
  cors({
    origin: ["https://wallpaper-weld.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Set the secure flag to true
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Session expires in 1 day
      sameSite: "none",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  res.send("API_RUNNING");
});

app.get("/user/:id", async (req, res) => {
  const data = await getdata({ UploaderID: req.params.id });
  if (data) res.send(data);
  res.status(404);
});
app.get("/home", async (req, res) => {
  const data = await getdata();
  if (data) res.send(data);
  res.status(404);
});
app.get("/users/info/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await User.findById(id, (err, user) => {
      console.log(user);
      res.json({
        displayName: user.displayName,
        Totallikes: user.Totallikes,
        followers: user.followerscount,
        photos: user.photos,
        id: user._id,
        About: user.About,
      });
    });
  } catch (err) {}
});
app.get("/filter/follower/:userid", async (req, res) => {
  const id = req.params.userid;
  var ids = [];

  const user = await User.findById(id);
  user.follow.forEach((items) => {
    ids.push(items.followers);
  });
  const followerdata = await getdata({ UploaderID: { $in: ids } });
  if (followerdata) {
    res.send(followerdata);
  } else {
    res.send(false);
  }
});
app.use("/", Like);
app.use("/", authRoute);
app.use("/", Upload);
app.use("/", follow);
app.use("/", search);
app.use("/", Imagegen);
app.use("/", Updates);
app.listen(process.env.PORT || 4000, () => {
  console.log("Server runnings");
});
