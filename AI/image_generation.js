const Router = require("express").Router();
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

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
module.exports = Router;
