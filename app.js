const express = require("express");
const userRouter = require("./routes/user.route");
require("dotenv").config();
const connectDB = require("./utils/connectDB");
const { errorhandler } = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//----Routes---
app.use("/api/v1/users", userRouter);

app.use(errorhandler); // middleware should come after the setting up the routes
connectDB("mongodb://127.0.0.1:27017/searchapp");
app.listen(PORT, () => console.log(`server is Live at ${PORT}`));
