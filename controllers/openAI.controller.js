const asyncHandler = require("express-async-handler");
const axios = require("axios");
const User = require("../models/User.model");
const ContentHistory = require("../models/ContentHistory.model");

// OpenAi controller
//newKey2 = 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
// OPENAI_API_KEY = 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

const openAIController = asyncHandler(async (req, res) => {
  // console.log(req.user);  // this is the loggedIn user who is trying to generate the text, can be seen from the isAuth file
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json", // this is the json data
        },
      }
    );
    // console.log(response.data);

    // sendint the content to the user
    const content = response?.data?.choices[0].text?.trim();

    const newContent = await ContentHistory.create({
      user: req?.user?._id,
      content,
    });
    // // put the content into the user
    const userFound = await User.findById(req?.user?.id);
    userFound.history.push(newContent?._id);
    userFound.apiRequestCount +=1 ;  // updating the api request count for each request 
    await userFound.save();

    res.status(200).json(content);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  openAIController,
};
