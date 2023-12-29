const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

// registration
const register = async (req, res) => {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  register,
};
