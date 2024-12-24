const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: String,
      ref: "ChatRoom",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatRoomSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: String,
      required: true,
      unique: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

module.exports = { Message, ChatRoom };
