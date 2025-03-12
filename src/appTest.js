const express = require("express");
const { connectDB } = require("../src/config/database");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const authRouter = require("../routes/auth");
const profileRouter = require("../routes/profile");
const requestRouter = require("../routes/request");

// app.use(express.json()); //middleware
// app.use(cookieParser()); //middleware
// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", requestRouter);
const mongoose = require("mongoose");
const schema = new mongoose.Schema({ name: String, size: String });
const Tank = mongoose.model("Tank", schema);
Tank.watch().on("change", (data) => {
  console.log(Date.now(), data);
});

app.use("/", async (req, res) => {
  try {
    const testSchema = new mongoose.Schema({
      name: { first: String, last: String },
      occupation: String,
      age: Number,
      comments: Array,
    });

    const TestModal = mongoose.model("Testing", testSchema);
    // const test = await TestModal.create({
    //   name: { first: "Manoj", last: "S" },
    //   comments: [1, 2, 3, 4, 5],
    //   occupation: "test",
    // });
    // const test2 = await TestModal.create({
    //   name: { first: "kjnasdkjdans", last: "S" },
    //   comments: [1, 2],
    //   occupation: "test",
    // });
    // const test3 = await TestModal.create({
    //   name: { first: "gokul", last: "S" },
    //   comments: [1, 2, 3, 4, 5, 6, 7, 8],
    //   occupation: "test",
    // });

    const hshs = await TestModal.find().$where(
      "this.comments.length === 10 || this.name.length === 5"
    );

    console.log("==>hshs", hshs);

    res.json("success");
  } catch (e) {
    res.status(400).json({ message: "error", e: e.message });
  }
});

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
