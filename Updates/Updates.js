const Router = require("express").Router();
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
Router.post("/check-password", async (req, res) => {
  const { Password } = req.body;

  const user = await User.findById(req.user._id);
  const match = await bcrypt.compare(Password, user.Password);
  if (match) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

Router.post("/update-password", async (req, res) => {
  const { Password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(Password, salt);
  const user = await User.findByIdAndUpdate(req.user._id, {
    Password: hash,
  });
  res.json({ success: true });
});
module.exports = Router;
