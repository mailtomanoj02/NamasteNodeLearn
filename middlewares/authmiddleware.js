const jwt = require("jsonwebtoken");
const { UserModel } = require("../src/models/user");
const privateKey = "Manoj@123@NamasteNodeJs";
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, privateKey);
    console.log(decoded);
    if (!decoded?.userId) {
      throw new error("Invalid Login");
    }
    const user = await UserModel.findById(decoded.userId);
    req.user = user;
    console.log("auth called");
    next();
  } catch (err) {
    res.status(401).send(err.message);
  }
};
module.exports = { userAuth };
