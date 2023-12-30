const asyncHandler = require("express-async-handler");
// const stripe = require("stripe")(process.env.MY_KEY)  // what is the difference , also I have to look in this part more (revise)
const stripe = require("stripe")(
  "sk_test_51OT0d1SFdvILEADbipAcxOMXnnsCjqDYCgNCq6JU3ccUgvl0YLfGVQlnr0Y1jEvQSCoJSWFW1MfEBCy6OY9OQSzG00eNyppiD9"
);

// --- strip payment---
const handleStripePayment = asyncHandler(async (req, res, next) => {
  console.log(process.env.MY_KEY);
  const { amount, subscriptionPlan } = req.body;
  //get the user
  const user = req?.user;
  //   console.log(user);
  try {
    // create payment intent  https://chat.openai.com/c/751d9910-196d-471f-9412-4f315d78762b
    console.log("hi");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "usd",
      // add some data , tha meta object
      metadata: {
        userId: user?._id?.toString(),
        userEmail: user?.email,
        subscriptionPlan,
      },
    });
    // send the response
    console.log(paymentIntent);
    res.json({
      clientSecret: paymentIntent?.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({error})
  }
});

module.exports = {
  handleStripePayment,
};
