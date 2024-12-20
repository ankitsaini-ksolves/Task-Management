const express = require("express");
const router = express.Router();
const { ChatRoom, Message } = require("../models/Chat");

router.post("/chat-room", async (req, res) => {
  const { user1, user2 } = req.body;

  try {
    let chatRoom = await ChatRoom.findOne({
      users: { $all: [user1, user2] },
    });

    if (!chatRoom) {
      chatRoom = new ChatRoom({ users: [user1, user2] });
      await chatRoom.save();
    }

    res.status(200).json(chatRoom);
  } catch (err) {
    res.status(500).json({ error: "Error creating chat room" });
  }
});

router.post("/messages", async (req, res) => {
  const { chatRoomId, sender, content } = req.body;

  try {
    const senderExists = await User.findById(sender);
    if (!senderExists) {
      return res.status(400).json({ error: "Invalid sender ID" });
    }

    const message = new Message({ chatRoomId, sender, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Error sending message" });
  }
});

router.get("/messages/:chatRoomId", async (req, res) => {
  console.log("INside")
  const { chatRoomId } = req.params;

  try {
    const messages = await Message.find({ chatRoomId }).populate(
      "sender",
      "username"
    );
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

module.exports = router;
