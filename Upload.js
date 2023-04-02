const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const Router = require("express").Router();
const ImageUpload = require("./Models/imageSchema");
const fileUpload = require("express-fileupload");
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
  console.log(req.files);
  if (!Image) return res.sendStatus(400);
  try {
    Image.mv(__dirname + "/uploads/" + Image.name, async (err) => {
      const data = await cloudinary.uploader.upload(
        path.join(__dirname + "/uploads/" + Image.name)
      );
      const date = new Date();
      const image = new ImageUpload({
        Name: req.body.Name,
        UserURL: req.body.UserIMG,
        Filename: Image.name,
        Date: date,
        UploaderID: req.body.UploaderID,
        Url: data.url,
      });
      await image.save();
      fs.unlink(path.join(__dirname, "uploads", Image.name), (err) => {
        if (!err) {
          res.status(200).send("uploaded");
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
});
Router.delete("/:imageID", async (req, res) => {
  try {
    const Name = await ImageUpload.findById(req.params.imageID);

    // url for name //
    const NameSplit = Name.Url.split("/");
    console.log(NameSplit);
    const NameID = NameSplit[NameSplit.length - 1].split(".");
    await cloudinary.uploader.destroy(NameID[0]);
    await ImageUpload.findByIdAndDelete(req.params.imageID);
    res.status(200).send("deleted");
  } catch (err) {}
});

module.exports = Router;
