const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const Router = require("express").Router();
const ImageUpload = require("./Models/imageSchema");
const fileUpload = require("express-fileupload");
const User = require("./Models/UserSchema");
const fs = require("fs");
Router.use(fileUpload());
const path = require("path");
cloudinary.config({
  cloud_name: "flow-db", // config
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
dotenv.config();
Router.post("/file/upload", async (req, res) => {
  const { Image } = req.files;
  const Name = req.body.ImageName;
  if (!Image) return res.sendStatus(400);
  Image.mv(__dirname + "/uploads/" + Image.name, async (err) => {
    const data = await cloudinary.uploader
      .upload(path.join(__dirname + "/uploads/" + Image.name))
      .catch((e) => {
        console.log(e);
      });
    const image = new ImageUpload({
      Name: req.body.UserName,
      UserURL: req.body.UserIMG,
      Filename: Name.replace(/ /g, "_"),
      Location: req.body.Location,
      Tags: req.body.Tags,
      UploaderID: req.body.UploaderID,
      Url: data.url,
    });
    await image.save().catch((e) => {
      console.log(e);
    });
    fs.unlink(path.join(__dirname, "uploads", Image.name), (err) => {
      if (!err) {
        res.status(200).send("uploaded");
      }
    });
  });
});
// removing images //
Router.delete("/:imageID", async (req, res) => {
  try {
    const Name = await ImageUpload.findById(req.params.imageID);
    console.log(req.user);
    if (Name.UploaderID === req.user._id) {
      const NameSplit = Name.Url.split("/");
      console.log(NameSplit);
      const NameID = NameSplit[NameSplit.length - 1].split(".");
      await cloudinary.uploader.destroy(NameID[0]);
      await ImageUpload.findByIdAndDelete(req.params.imageID);
      res.status(200).send(true);
    } else res.status(502).send("not allowed");
  } catch (err) {
    console.log(err);
  }
});
Router.post("/ProfileUpdate/upload/:UserID", async (req, res) => {
  const { Image } = req.files;
  const id = req.params.UserID;
  if (!Image) return res.sendStatus(400);
  Image.mv(__dirname + "/uploads/" + Image.name, async (err) => {
    const data = await cloudinary.uploader
      .upload(path.join(__dirname + "/uploads/" + Image.name))
      .catch((e) => {
        console.log(e);
      });
    const user = await User.findById(id);
    user.photos = data.url;
    await user.save();
  });
});
module.exports = Router;
