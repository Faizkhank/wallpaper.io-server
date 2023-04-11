const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });
const ImageUploadSchema = new mongoose.Schema(
  {
    Name: String,
    DateofUpload: String,
    Filename: String,
    UserURL: String,
    UploaderID: String,
    Url: String,
    Location: String,
    Tags: String,
    Likes: [{ likeduser: String }],
    Views: [{ Views: String }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const ImageUpload = mongoose.model("image", ImageUploadSchema);
module.exports = ImageUpload;
