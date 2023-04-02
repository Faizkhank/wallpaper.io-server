const Router = require("express").Router();
const User = require("./Models/UserSchema");
const ImageUpload = require("./Models/imageSchema");

Router.post("/Likes/wallpaper/:imageID/:userID", async (req, res) => {
  const id = req.params.imageID;
  const userliked = req.params.userID;
  ImageUpload.findById(id, async (err, result) => {
    console.log(result);
    const found = result.Likes.some((item) => item.likeduser === userliked);
    if (found === true) {
      try {
        const user = await ImageUpload.findByIdAndUpdate(id, {
          $pull: { Likes: { likeduser: userliked } },
        });

        const users = await User.findOneAndUpdate(
          { GoogleID: user.UploaderID },
          {
            $inc: { Totallikes: -1 },
          }
        );
        res.send("done");
      } catch (err) {}
    } else {
      try {
        const user = await ImageUpload.findByIdAndUpdate(req.params.imageID, {
          $push: { Likes: { likeduser: userliked } },
        });
        await User.findOneAndUpdate(
          { GoogleID: user.UploaderID },
          {
            $inc: { Totallikes: 1 },
          }
        );

        res.send("done");
      } catch (err) {}
    }
  });
});

Router.get("/checklike/:imageID/:userID", async (req, res) => {
  const id = req.params.imageID;
  const userid = req.params.userID;
  if (req.user) {
    ImageUpload.findById(id, (err, result) => {
      const found = result.Likes.some((item) => item.likeduser === userid);
      if (found) {
        res.send(true);
      } else {
        res.send(false);
      }
    });
  } else {
    res.send(false);
  }
});
module.exports = Router;
