const express = require("express");

const { isAuthorised } = require("../middleware/auth.middleware");
const { openAIController } = require("../controllers/openAI.controller");

const openAIRouter = express.Router();

openAIRouter.post("/generate-content", isAuthorised, openAIController);

module.exports = {openAIRouter};
