const express = require("express");
const userRouter = require("./routes/user.route");
const connectDB = require("./utils/connectDB");
const { errorhandler } = require("./middleware/error.middleware");
const cookieParser = require("cookie-parser");
const { openAIRouter } = require("./routes/openAI.route");
const paymentRouter = require("./routes/stripePayment.route");
const cron = require("node-cron");
const User = require("./models/User.model");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//it will check for the free Trial and run for at the end of each day
cron.schedule("0 0 * * * *", async () => {
  try {
    const today = Date();
    await User.updateMany(
      {
        // it look for the user with the trial active  true and whose trial Expire meaning currently in the trial period and but reached the trial expired
        trialActive: true,
        trialExpires: { $lt: today },
      },
      {
        // it will update all the uesrs with the expired trial period and make their subscription plan to the free and their monthly reequescount to the 5 api request count
        trialActive: false,
        subscriptionPlan: "Free",
        monthlyRequestCount: 5,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
});

//it will check for the free Trial and run at the end of each month
cron.schedule("0 0 1 * * *", async () => {
  try {
    const today = Date();
    await User.updateMany(
      {
        // it look for the user with the Freetrial but but reached the next billing date
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      {
        // it will update all the uesrs with the expired Free Plan period and make their monthlyRequesapi count 0
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
});

//it will check for the Basic Trial and run for every single hour
cron.schedule("0 0 1 * * *", async () => {
  try {
    const today = Date();
    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
});
// it will check for the user with the exprired  premium plan
cron.schedule("0 0 1 * * *", async () => {
  try {
    const today = Date();
    await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
});

app.use(cookieParser()); // pass the cookie automatically by default express do not pass the cookie directly so we need to install the cookie-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
//----Routes---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/openAI", openAIRouter);
app.use("/api/v1/payment", paymentRouter);

app.use(errorhandler); // middleware should come after the setting up the routes
connectDB(process.env.MONGO_URI);
app.listen(PORT, () => console.log(`server is Live at ${PORT}`));
