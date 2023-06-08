const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/UserSchema");

Router.put("/users/:userId/about", async (req, res) => {
  const { userId } = req.params;
  const { about } = req.body;
  console.log(about);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.About = about;
    await user.save();

    res.json({ message: "About section updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
Router.post("/check-password/:userid", async (req, res) => {
  const { Password } = req.body;

  const user = await User.findById(req.params.userid);
  const match = await bcrypt.compare(Password, user.password);
  if (match) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

Router.post("/update-password/:userid", async (req, res) => {
  const { Password } = req.body;
  const hash = await bcrypt.hash(Password, 10);
  const id = req.params.userid;
  const user = await User.findByIdAndUpdate(id, {
    password: hash,
  });
  res.json({ success: true });
});
module.exports = Router;
