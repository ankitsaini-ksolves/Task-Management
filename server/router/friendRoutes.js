const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get all users (excluding the current user)
router.get("/", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const currentUser = await User.findById(userId).select(
      "friends friendRequests sentFriendRequests"
    );

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const receivedFriendRequests = currentUser.friendRequests
      .filter((req) => req.status === "pending")
      .map((req) => req.from.toString());

    const sentFriendRequests = currentUser.sentFriendRequests.map((id) =>
      id.toString()
    );

    // Filter out the current user, friends, received requests, and sent requests
    const excludedUserIds = [
      userId,
      ...currentUser.friends.map((id) => id.toString()),
      ...receivedFriendRequests,
      ...sentFriendRequests,
    ];

    const users = await User.find({
      _id: { $nin: excludedUserIds },
    }).select("username email profileImage");

    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch users", message: err.message });
  }
});

// Send friend request
router.post("/friend-request", async (req, res) => {
  const { fromUserId, toUserId } = req.body;

  if (!fromUserId || !toUserId) {
    return res
      .status(400)
      .json({ error: "Both fromUserId and toUserId are required" });
  }

  try {
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) {
      return res.status(404).json({ error: "User(s) not found" });
    }

    if (fromUser.sentFriendRequests.includes(toUserId)) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    fromUser.sentFriendRequests.push(toUserId);
    await fromUser.save();

    toUser.friendRequests.push({ from: fromUserId, status: "pending" });
     const result= await toUser.save();

    res
      .status(200)
      .json({ message: "Friend request sent successfully", result });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to send friend request", message: err.message });
  }
});

// Accept or reject friend request
router.put("/friend-request", async (req, res) => {
  const { userId, requestId, action } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const requestIndex = user.friendRequests.findIndex(
      (req) => req._id.toString() === requestId
    );

    const friendRequest = user.friendRequests[requestIndex];
    const fromUserId = friendRequest.from;

    if (action === "accept") {
      // Add to friends list
      user.friends.push(fromUserId);
      await user.save();

      const fromUser = await User.findById(fromUserId);
      fromUser.friends.push(userId);
      fromUser.sentFriendRequests = fromUser.sentFriendRequests.filter(
        (id) => id.toString() !== userId
      );
      await fromUser.save();

      user.friendRequests.splice(requestIndex, 1);
      await user.save();

      return res.status(200).json({ message: "Friend request accepted" });
    } else if (action === "reject") {
      user.friendRequests.splice(requestIndex, 1);
      await user.save();

      const fromUser = await User.findById(fromUserId);
      fromUser.sentFriendRequests = fromUser.sentFriendRequests.filter(
        (id) => id.toString() !== userId
      );
      await fromUser.save();

      return res.status(200).json({ message: "Friend request rejected" });
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to handle friend request", message: err.message });
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

  try {
    const user = await User.findById(userId).populate(
      "friends",
      "username email profileImage"
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

router.delete("/:friendId", async (req, res) => {
  const { friendId } = req.params;
  const { userId } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    ).populate("friends");

    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser.friends);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete friend", message: error.message });
  }
});

module.exports = router;
