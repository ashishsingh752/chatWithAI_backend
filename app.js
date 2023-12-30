const express = require("express");
const userRouter = require("./routes/user.route");
require("dotenv").config();
const connectDB = require("./utils/connectDB");
const { errorhandler } = require("./middleware/error.middleware");
const cookieParser = require("cookie-parser");
const {openAIRouter} = require("./routes/openAI.route");
    
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser()); // pass the cookie automatically by default express do not pass the cookie directly so we need to install the cookie-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
    
//----Routes---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/openAI", openAIRouter);

app.use(errorhandler); // middleware should come after the setting up the routes
connectDB("mongodb://127.0.0.1:27017/searchapp");
app.listen(PORT, () => console.log(`server is Live at ${PORT}`));
