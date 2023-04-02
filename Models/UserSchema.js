const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  GoogleID: String,
  username: String,
  displayName: String,
  photos: String,
  email: String,
  password: String,
  Totallikes: { type: Number, default: "0" },
  followers: [{ followers: String }],
  Totalviews: { type: Number, default: "0" },
  followerscount: { type: Number, default: "0" },
});
userSchema.plugin(passportLocalMongoose);
userSchema.methods.validPassword = function (pwd) {
  return this.password === pwd;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
