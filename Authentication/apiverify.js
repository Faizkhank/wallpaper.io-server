const dotenv = require("dotenv");
dotenv.config();
const authenticateKey = (req, res, next) => {
  let api_key = req.header("x-api-key");
  const nonSecurePaths = ["/logout", "/google"];
  if (nonSecurePaths.includes(req.path)) return next();
  if (api_key === process.env.API_KEY_WALLPAPER) {
    next();
  } else {
    res.status(403).send({ error: { code: 403, message: "You not allowed." } });
  }
};
module.exports = { authenticateKey };
