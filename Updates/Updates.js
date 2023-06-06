const Router = require("express").Router();
const User = require("../Models/UserSchema");
Router.put("/users/:userId/about", async (req, res) => {
  console.log(req.user);
  const { userId } = req.params;
  const { about } = req.body.about;

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
