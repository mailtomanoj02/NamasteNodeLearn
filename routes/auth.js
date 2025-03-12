const { UserModel } = require("../src/models/user");
const {
  signUpValidation,
  loginValidation,
} = require("../src/utils/validation");
const bcrypt = require("bcrypt");
const authRouter = require("express").Router();

authRouter.post("/signup", async (req, res) => {
  try {
    signUpValidation(req.body);
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
    }); //creating an instance of UserModel
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    loginValidation(req.body);
    const { emailId, password } = req.body;
    const user = await UserModel.findOne({ emailId });
    if (user) {
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      const token = await user.getJwt();
      console.log(token);
      if (isPasswordMatched) {
        res.cookie("token", token, {
          expires: new Date(Date.now() + 900000),
        });
        res.send("Login Success");
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token").send("Logged out successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = authRouter;
