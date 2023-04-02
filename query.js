const ImageUpload = require("./Models/imageSchema");
const getdata = async (filter) => {
  const data = await ImageUpload.find(filter).limit(6);
  if (data) {
    var result = [];
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
  }
};
module.exports = getdata;
