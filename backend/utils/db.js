const mongoose = require("mongoose");

const connectToMongo = async (URI) => {
  try {
    await mongoose.connect(URI);
    console.log("Connection successfully moongo");
  } catch (e) {
    console.log(e);
  }
};

module.exports = connectToMongo;