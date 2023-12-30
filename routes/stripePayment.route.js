const express = require("express");
const { isAuthorised } = require("../middleware/auth.middleware");
const { handleStripePayment } = require("../controllers/payment.controller");

const paymentRouter = express.Router();

paymentRouter.post("/checkout", isAuthorised, handleStripePayment);

module.exports = paymentRouter;
