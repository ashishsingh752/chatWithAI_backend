const asyncHandler = require("express-async-handler");
const calculateNextBillingDate = require("../utils/nextBillingDate");
const shouldRenewal = require("../utils/shouldRenewal");
const Payment = require("../models/Payment.model");
const User = require("../models/User.model");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_ID);

// !--- strip payment---
const handleStripePayment = asyncHandler(async (req, res, next) => {
  // console.log(process.env.MY_KEY);
  const { amount, subscriptionPlan, payment_method } = req.body;
  //get the user
  const user = req?.user;
    console.log(user);
  try {
    // create payment intent  https://chat.openai.com/c/751d9910-196d-471f-9412-4f315d78762b
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "usd",
      // payment_method_types:["card"],
      metadata: {
        userId: user?._id?.toString(),
        userEmail: user?.email,
        subscriptionPlan,
        // payment_method,
      },
    });
    // send the response
    console.log('this is the payment Intent', paymentIntent?.client_secret);
    res.json({
      clientSecret: paymentIntent?.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error:error });
  }
});

//!------handleFreePlan Payment
const handleFreePlan = asyncHandler(async (req, res) => {
  const user = req?.user; //get the login user

  //check for the renewal of the user account
  try {
    if (shouldRenewal(user)) {
      user.subscriptionPlan = "Free";
      user.monthlyRequestCount = 5;
      user.apiRequestCount = 0;
      user.nextBillingDate = calculateNextBillingDate();
      // create a new payment for the freePlan and save into the db
      const newPayment = await Payment.create({
        user: user?.id,
        subscriptionPlan: "Free",
        amount: 0,
        status: "Success",
        reference: Math.random().toString(36).substring(7),
        monthlyRequestCount: 5,
        currency: "usd",
      });

      user.payments.push(newPayment?._id);

      await user.save();

      res.json({
        status: "success",
        message: "Subscription plan updated successfully",
        user,
      });
    } else {
      return res.status(403).json({ error: "subscription not due yet!" });
    }
  } catch (error) {
    throw new Error(error);
  }
  // create a new payment ans save into db
  // update the user account
});

//!----- handle the verified Payment user
const handleVerifiedPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  // console.log(paymentId);
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);  // to know to complete payment intent of the user 
    // console.log(paymentIntent);
    if (paymentIntent.status === "succeeded") { 
      // get the user metadata
      const metadata = paymentIntent?.metadata;
      const subscriptionPlan = metadata?.subscriptionPlan;
      const userEmail = metadata?.userEmail;
      const userId = metadata?.userId;

      // find the user
      const userFound = await User.findById(userId);
      if (!userFound) {
        return res.status(404).json({
          status: "false",
          message: "User not found",
        });
      }
      // get the payment details
      const amount = paymentIntent?.amount / 100;
      const currency = paymentIntent?.currency;
      const paymentId = paymentIntent?.id;
      // create the payment history of the user
      const newPayment = await Payment.create({
        user: userId,
        email: userEmail,
        subscriptionPlan,
        currency,
        amount,
        status: "success",
        reference: paymentId,
      });
      // check for the subscription plan of the user
      if (subscriptionPlan === "Basic") {
        const updatedUser = await User.findByIdAndUpdate(userId, {

          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          subscriptionPlan:"Basic",
          monthlyRequestCount:50,
          $addToSet: {
            payments: newPayment?._id,
          },
        });
        res.json({
          status:true,
          message: "Payment verified, user updated successfully",
          updatedUser,
        })
      }
      // for the premium Plan 
      if (subscriptionPlan === "Premium") {
        const updatedUser = await User.findByIdAndUpdate(userId, {
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount:100,
          subscriptionPlan:"Premium",
          $addToSet: {
            payments: newPayment?._id,
          },
        });
        res.json({
          status:true,
          message: "Payment verified, user updated successfully",
          updatedUser,
        })
      }
      // await newPayment.save();
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  handleStripePayment,
  handleFreePlan,
  handleVerifiedPayment,
};
