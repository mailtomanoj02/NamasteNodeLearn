const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const privateKey = "Manoj@123@NamasteNodeJs";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxLength: 20 },
  lastName: { type: String, maxLength: 10 },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowerCase: true,
    validate: (email) => {
      if (!validator.isEmail(email)) {
        throw new Error("Invalid email address");
      }
    },
  },
  age: { type: Number, max: 25 },
  password: { type: String, required: true, trim: true },
  gender: {
    type: String,
    trim: true,
    runValidators: true,
    validate: (key) => {
      if (!["male", "female", "others"].includes(key)) {
        throw new Error("Invalid gender");
      }
    },
  },
  photoUrl: {
    type: String,
    validate: (url) => {
      if (!validator.isURL(url)) {
        throw new Error("Invalid Url");
      }
    },
  },
});
userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ userId: user._id }, privateKey, {
    expiresIn: "1d",
  });
  return token;
};
const UserModel = mongoose.model("User", userSchema);
module.exports = { UserModel };
