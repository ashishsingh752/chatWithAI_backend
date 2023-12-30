const express = require("express");
const { apiReqest } = require("../middleware/apiRequest.middleware");
const { isAuthorised } = require("../middleware/auth.middleware");
const { openAIController } = require("../controllers/openAI.controller");

const openAIRouter = express.Router();

openAIRouter.post(
  "/generate-content",
  isAuthorised,
  apiReqest,
  openAIController
);

module.exports = { openAIRouter };
