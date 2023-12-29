const mongoose = require("mongoose");

// const url = "mongodb://127.0.0.1:27017/searchapp";
// mongoose.connect("mongodb://127.0.0.1:27017/searchapp", ()=>console.log('connected to the mongoDB'));
const connectDB = async (url) => {
  try {
    const connected = await mongoose.connect(url);
    console.log("connected to the mongoDB");
  } catch (error) {
    console.log(`Error on connecting to the mongoDB ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
