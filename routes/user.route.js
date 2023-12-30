const express = require("express");
const {
  register,
  login,
  logout,
  profile,
} = require("../controllers/user.controller");
const { isAuthorised } = require("../middleware/auth.middleware");

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/profile", isAuthorised, profile);

module.exports = userRouter;
