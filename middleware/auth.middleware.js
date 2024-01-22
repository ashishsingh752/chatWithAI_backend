const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const isAuthorised = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    //!verify the user with the token 
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);   // this is the actual login user
    // console.log(decoded);
    req.user = await User.findById(decoded?.id).select("-password");  // here we are adding the loggedIn user to the request object so that we can access it anywhere
    next();
  } else {
    return res.status(401).json({ message: "Not authorised, no token found" });
  }
});

module.exports = {
  isAuthorised,
};
