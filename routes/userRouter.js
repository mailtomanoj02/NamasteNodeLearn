const { userAuth } = require("../middlewares/authmiddleware");
const ConnectionRequestModal = require("../src/models/connectionRequest");
const { UserModel } = require("../src/models/user");

const userRouter = require("express").Router();
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log("me==>", loggedInUser);
    const data = await ConnectionRequestModal.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "gender",
      "age",
      "photoUrl",
    ]);
    console.log("==>request", data);
    res.json({ message: "success", data });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    let data = await ConnectionRequestModal.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
      ]);

    data = data.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "success", data });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let limit = req.query?.limit || 10;
    limit = limit > 50 ? 50 : limit;
    const page = req.query?.page || 1;
    console.log("1==>");
    const connectionReq = await ConnectionRequestModal.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .select(["fromUserId", "toUserId"])
      .populate("fromUserId", "firstName")
      .populate("toUserId", "firstName");
    console.log("2==>", connectionReq);
    const hideUsers = new Set();
    const hiddenUsers = connectionReq.forEach((req) => {
      hideUsers.add(req.fromUserId._id.toString());
      hideUsers.add(req.toUserId._id.toString());
    });
    console.log("3==>");
    const users = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(["firstName", "lastName", "age", "gender", "photoUrl"])
      .skip((page - 1) * limit)
      .limit(limit);
    console.log("==>", hideUsers);
    res.json({ message: "success", users });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
module.exports = userRouter;
