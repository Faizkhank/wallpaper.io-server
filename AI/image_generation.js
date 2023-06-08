const Router = require("express").Router();
const dotenv = require("dotenv");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const ImageUpload = require("../Models/imageSchema");
const User = require("../Models/UserSchema");
dotenv.config();
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const configuration = new Configuration({
  apiKey: process.env.AI_KEY,
});
const openai = new OpenAIApi(configuration);

cloudinary.config({
  cloud_name: "flow-db", // config
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

Router.post("/gen", async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);
  const imageSize = "1024x1024";

  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: imageSize,
    });

    const imageUrl = response.data.data[0].url;
    console.log(imageUrl);
    res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.status(400).json({
      success: false,
      error: "The image could not be generated",
    });
  }
});
Router.post("/upload/ai/:userID", async (req, res) => {
  const { url, Name, tags, Location } = req.body;
  const id = req.params.userID;
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(url);
    const user = await User.findById(id);
    const cloudinaryImageUrl = cloudinaryResponse.secure_url;
    console.log(cloudinaryImageUrl);
    const image = new ImageUpload({
      Name: user.displayName,
      Filename: Name + " " + "ai",
      UserURL: user.photos,
      Tags: tags + " " + "ai",
      UploaderID: id,
      Location: Location,
      Url: cloudinaryImageUrl,
    });
    await image.save();
    res.status(200).json({ message: "Image saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save the image." });
  }
});
module.exports = Router;
