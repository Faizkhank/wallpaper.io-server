const ImageUpload = require("./Models/imageSchema");
const User = require("./Models/UserSchema");
const getdata = async (filter) => {
  const data = await ImageUpload.find(filter)
    .limit(10)
    .sort({createdAt: "asc"});

  if (data) {
    var result = [];

    for (const items of data) {
      const userurl = await User.findById(items.UploaderID);

      const obj = {
        _id: items._id,
        Name: items.Name,
        Filename: items.Filename,
        UserURL: userurl.photos,
        UploaderID: items.UploaderID,
        Url: items.Url,
        Likes: items.Likes.length,
      };
      result.push(obj);
    }

    return result;
  }
};
module.exports = getdata;
