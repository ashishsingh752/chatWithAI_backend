const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// registration
// asyncherror handler is used to handle the asynchronous error  and it is the best practive instead of the try and catch method , it make the error handling more streamline
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required!");
  }

  // check if the email is already registered
  const userExits = await User.findOne({ email });
  if (userExits) {
    res.status(400);
    throw new Error("user already exists");
  }

  // hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // const hashedPassword = bcryptjs.hashSync(password, 10);

  //create  new user if no email found
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  newUser.trialExpires = new Date(
    new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
  );

  await newUser.save();

  res.json({
    status: true,
    message: "Registration successfull",
    user: {
      username,
      email,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("Invalid Credentials");
  }
  // checking for the passwod
  const isMatch = await bcrypt.compare(password, user?.password);
  //   const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid Credentials");
  }

  // generate the token for the user
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRETE, {
    expiresIn: "3d", // token will expire in 3 days
  });

  console.log(token);

  // setting the token into the cookie (httpOnly)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // cookie valid for the one day only
  });

  return res.json({
    user: user.email,
    _id: user?._id,
  });
});

module.exports = {
  register,
  login,
};
