const express = require("express");
const { apiReqest } = require("../middleware/apiRequest.middleware.js");
const { isAuthorised } = require("../middleware/auth.middleware.js");
const { openAIController } = require("../controllers/openAI.controller.js");

const openAIRouter = express.Router();

openAIRouter.post(
  "/generate-content",
  isAuthorised,
  apiReqest,
  openAIController
);

module.exports = { openAIRouter };
