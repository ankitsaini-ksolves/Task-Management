const express = require("express");
const router = express.Router();
const { ChatRoom, Message } = require("../models/Chat");

// Create or fetch a chat room
router.post("/chat-room", async (req, res) => {
  const { user1, user2 } = req.body;

  try {
    let chatRoom = await ChatRoom.findOne({
      users: { $all: [user1, user2] },
    });

    if (!chatRoom) {
      const chatRoomId = `${user1}_${user2}`;

      chatRoom = new ChatRoom({
        chatRoomId,
        users: [user1, user2],
      });

      await chatRoom.save();
    }
    res.status(200).json(chatRoom);
  } catch (err) {
    console.error("Error creating chat room:", err);
    res.status(500).json({ error: "Error creating chat room" });
  }
});

// Save a new message
router.post("/messages", async (req, res) => {
  const { chatRoomId, sender, content } = req.body;

  try {
    // Create and save the message
    const message = new Message({ chatRoomId, sender, content });
    await message.save();

    const populatedMessage = await message.populate("sender", "username");
    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("Error details:", err); // Log the actual error
    res.status(500).json({ error: "Error saving message" });
  }
});


// Fetch messages for a chat room
router.get("/messages/:chatRoomId", async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    const messages = await Message.find({ chatRoomId }).populate(
      "sender",
      "username"
    );
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

module.exports = router;
