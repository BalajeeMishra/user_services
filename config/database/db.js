const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("db connected");
  } catch (err) {
    process.exit(1);
  }
};

module.exports = connectDB;
