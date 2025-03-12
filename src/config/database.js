const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ManojFoodhub:ManojFoodhubPassword@nodelearnnamste.dgw8r.mongodb.net/"
  );
};
module.exports = { connectDB };
