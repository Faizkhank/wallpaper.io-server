const Router = require("express").Router();
const ImageUpload = require("./Models/imageSchema");
const get = (data) => {
  const result = [];
  data.forEach((items) => {
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
  return result;
};
Router.get("/api/search", async (req, res) => {
  const query = req.query.q;
  const page = req.query.p;
  console.log(page);
  try {
    const data = await ImageUpload.find({
      $or: [
        { Name: { $regex: query, $options: "i" } }, // search by name
        { Filename: { $regex: query, $options: "i" } }, // search by description
        { tags: { $regex: query, $options: "i" } }, // search by tags
      ],
    })
      .skip(page)
      .limit(10);
    if (data) {
      const response = await get(data);
      res.send(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
Router.get("/api/page_0/search", async (req, res) => {
  const query = req.query.q;

  try {
    const data = await ImageUpload.find({
      $or: [
        { Name: { $regex: query, $options: "i" } }, // search by name
        { Filename: { $regex: query, $options: "i" } }, // search by description
        { tags: { $regex: query, $options: "i" } }, // search by tags
      ],
    }).limit(10);
    if (data) {
      const response = await get(data);
      res.send(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
Router.get("/data", async (req, res) => {
  const query = req.query.page;
  try {
    const data = await ImageUpload.find({}).skip(query).limit(10);
    if (data) {
      const response = await get(data);
      res.send(response);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = Router;
