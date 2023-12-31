const express = require("express");
const { isAuthorised } = require("../middleware/auth.middleware");
const { handleStripePayment, handleFreePlan, handleVerifiedPayment } = require("../controllers/payment.controller");

const paymentRouter = express.Router();

paymentRouter.post("/checkout", isAuthorised, handleStripePayment);
paymentRouter.post("/free-plan",isAuthorised, handleFreePlan);
paymentRouter.post('/verified-payment/:paymentId',isAuthorised, handleVerifiedPayment);
module.exports = paymentRouter;
