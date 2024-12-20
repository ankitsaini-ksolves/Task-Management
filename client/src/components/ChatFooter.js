import { useState } from "react";
import { useSelector } from "react-redux";
import socket from "../socket";

const ChatFooter = ({ chatRoomId }) => {
  const [message, setMessage] = useState([]);
  const userId = useSelector((state) => state.auth.userId);

  const sendMessage = () => {
    if (message.trim() && chatRoomId) {
      const newMessage = { chatRoomId, sender: userId, content: message };

      // Emit to server
      socket.emit("send-message", newMessage);

      setMessage((prev) =>
        Array.isArray(prev) ? [...prev, newMessage] : [newMessage]
      );

      setMessage("");
    }
  };


  return (
    <div className="chat-footer d-flex align-items-center p-2">
      <input
        type="text"
        className="form-control me-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="btn btn-primary" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatFooter;
