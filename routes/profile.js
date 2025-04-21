const { userAuth } = require("../middlewares/authmiddleware");
const { UserModel } = require("../src/models/user");
const bcrypt = require("bcrypt");
const {
  validateEditProfiledata,
  validatForgotPasswordData,
} = require("../src/utils/validation");

const profileRouter = require("express").Router();
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.send({ outcome: "success", data: user });
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.patch("/profile", userAuth, async (req, res) => {
  try {
    const body = req.body;
    validateEditProfiledata(body);
    const user = req.user;
    console.log("==>", user, body);
    const updatedData = await UserModel.findByIdAndUpdate(user._id, body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.json({ message: "Profile updated Successfully", user: updatedData });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    const body = req.body;
    validatForgotPasswordData(body);
    const user = req.user;
    const isPasswordmatch = await bcrypt.compare(
      body.oldPassword,
      user.password
    );
    if (isPasswordmatch) {
      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      user.password = hashedPassword;
      user.save();
      console.log(user);
      res.json({ message: "Password updated successfully" });
    } else {
      throw new Error("Wrong password");
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = profileRouter;
