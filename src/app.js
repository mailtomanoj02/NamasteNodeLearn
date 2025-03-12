const express = require("express");
const { connectDB } = require("../src/config/database");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const authRouter = require("../routes/auth");
const profileRouter = require("../routes/profile");
const requestRouter = require("../routes/request");
const userRouter = require("../routes/userRouter");

app.use(express.json()); //middleware
app.use(cookieParser()); //middleware
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`); // mongodb+srv://ManojFoodhub:ManojFoodhubPassword@nodelearnnamste.dgw8r.mongodb.net/
    });
  })
  .catch((err) => {
    console.log(err);
  });
