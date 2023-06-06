const Router = require("express").Router();
const User = require("./Models/UserSchema");
Router.put("/follow/:userID/:followID", async (req, res) => {
  const userID = req.params.userID;
  const id = req.params.followID;
  const Usersave = await User.findById(userID);
  const found = Usersave.followers.some((item) => item.followers === id);
  if (found) {
    // User is not following, so add follower
    await User.findOneAndUpdate(
      { _id: userID },
      {
        $pull: {
          followers: { followers: id },
        },
        $inc: { followerscount: -1 },
      }
    );
    res.send(false);
  } else {
    // User is following, so remove follower
    await User.findOneAndUpdate(
      { _id: userID },
      {
        $push: {
          followers: { followers: id },
        },
        $inc: { followerscount: 1 },
      }
    );

    res.send(true);
  }

  res.status(502);
});
Router.get("/checkfollow/:followID/:followerID", async (req, res) => {
  const userid = req.params.followerID;
  console.log(req.params.followID);
  const id = req.params.followID;

  User.findById(id, (err, result) => {
    const found = result.followers.some((item) => item.followers === userid);
    if (found) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});
module.exports = Router;
