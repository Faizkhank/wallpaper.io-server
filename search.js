const Router = require("express").Router();
const ImageUpload = require("./Models/imageSchema");
Router.get("/api/search", async (req, res) => {
  const query = req.query.q;
  try {
    const results = await ImageUpload.find({
      $or: [
        { Name: { $regex: query, $options: "i" } }, // search by name
        { Filename: { $regex: query, $options: "i" } }, // search by description
        { tags: { $regex: query, $options: "i" } }, // search by tags
      ],
    }).limit(6);
    if (results) {
      var result = [];
      results.forEach((items) => {
        const obj = {
          _id: items._id,
          Name: items.Name,
          Filename: items.Filename,
          UserURL: items.UserURL,
          UploaderID: items.UploaderID,
          Url: items.Url,
          Likes: items.Likes.length,
        };
        result.push(obj);
      });
      res.send(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
Router.get("/data", async (req, res) => {
  const query = req.query.page;
  try {
    const results = await ImageUpload.find({}).skip(query).limit(10);
    if (results) {
      var result = [];
      results.forEach((items) => {
        const obj = {
          _id: items._id,
          Name: items.Name,
          Filename: items.Filename,
          UserURL: items.UserURL,
          UploaderID: items.UploaderID,
          Url: items.Url,
          Likes: items.Likes.length,
        };
        result.push(obj);
      });
      res.send(result);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = Router;
