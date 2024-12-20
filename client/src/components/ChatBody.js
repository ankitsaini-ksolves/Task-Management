import { useEffect, useState } from "react";
import socket from "../socket";
import { useSelector } from "react-redux";

const ChatBody = ({ chatRoomId, friend }) => {
  const [messages, setMessages] = useState([]);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    // Join the chat room
    if (chatRoomId) {
      socket.emit("join-room", chatRoomId);

      // Fetch previous messages
      fetch(`http://localhost:5000/chat/messages/${chatRoomId}`)
        .then((res) => res.json())
        .then((data) => {setMessages(data)
          console.log(data)
        });
    }

    // Listen for new messages
socket.on("receive-message", (message) => {
  setMessages((prev) => {
    if (Array.isArray(prev)) {
      return [...prev, message];
    } else {
      console.error("Messages state is not an array");
      return [message];
    }
  });
  console.log(messages)
});


    return () => {
      socket.off("receive-message");
    };
  }, [chatRoomId, socket]);

  return (
    <div className="chat-body p-3">
      <h4>Chat with {friend.username}</h4>
      <div className="messages scrollable">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="message_chats">
              {msg.sender._id === userId ? (
                <>
                  <p className="mt-3 mb-0 sender_name">You</p>
                  <div className="sender_msg">{msg.content}</div>
                </>
              ) : (
                <>
                  <p className="mb-0 mt-3 message_chats">
                    {msg.sender.username}
                  </p>
                  <div className="recipient_msg">{msg.content}</div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="no-messages text-center mt-4">
            <p className="text-muted">No chats yet. Start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBody;
