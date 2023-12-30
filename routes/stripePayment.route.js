const express = require("express");
const { isAuthorised } = require("../middleware/auth.middleware");
const { handleStripePayment, handleFreePlan } = require("../controllers/payment.controller");

const paymentRouter = express.Router();

paymentRouter.post("/checkout", isAuthorised, handleStripePayment);
paymentRouter.post("/free-plan",isAuthorised, handleFreePlan);
module.exports = paymentRouter;
