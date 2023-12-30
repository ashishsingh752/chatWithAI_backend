const mongoose = require("mongoose");

// userSchema

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    trialPeriod: {
      type: Number,
      default: 3,
    },
    trialActive: {
      type: Boolean,
      default: true,
    },
    trialExpires: {
      type: Date,
    },
    subscriptionPlan: {
      type: String,
      enum: ["Try", "Free", "Basic", "Premium"],
    },
    apiRequestCount: {
      type: Number,
      default: 10,
    },
    monthlyRequestCount: {
      type: Number,
      default: 100, // within 3 days
    },
    nextBillingDate: Date,
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "History",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, //This option suggests that Mongoose should include virtual properties when converting a document to JSON
    toObject: { virtuals: true }, // virtual properties should be included when converting a Mongoose document to a plain JavaScript object
  }
);

//virtual properties: Virtual properties are additional properties that are not stored in the database but are computed based on the existing data in the document.
// but we can have access to it upon querying adding virtual properties for the 3 day trial and query expiration

userSchema.virtual("isTrialActive").get(function () {
  return this.trialActive && new Date() < this.trialExpires;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
