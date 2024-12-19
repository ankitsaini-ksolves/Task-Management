const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get all users (excluding the current user)
router.get("/", async (req, res) => {
  const { userId } = req.query;
  try {
    const users = await User.find({ _id: { $ne: userId } }).select(
      "username email"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Send friend request
router.post("/friend-request", async (req, res) => {
  const { fromUserId, toUserId } = req.body;
  try {
    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ error: "User not found" });

    toUser.friendRequests.push({ from: fromUserId });
    await toUser.save();
    res.json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send friend request" });
  }
});

// Accept or reject friend request
router.put("/friend-request", async (req, res) => {
  const { userId, requestId, action } = req.body; // action: "accept" or "reject"
  try {
    const user = await User.findById(userId);
    const request = user.friendRequests.id(requestId);

    if (!request) return res.status(404).json({ error: "Request not found" });

    if (action === "accept") {
      user.friends.push(request.from);
      request.status = "accepted";
    } else if (action === "reject") {
      request.status = "rejected";
    }

    await user.save();
    res.json({ message: `Request ${action}ed successfully` });
  } catch (err) {
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Get friend requests for the user
router.get("/friend-requests/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate(
      "friendRequests.from",
      "username email"
    );
    res.json(user.friendRequests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch friend requests" });
  }
});

router.get("/all-friends/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(userId)

  try {
    const user = await User.findById(userId).populate(
      "friends",
      "username email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user.friends);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
