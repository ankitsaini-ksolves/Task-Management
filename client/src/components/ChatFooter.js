import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, fetchMessages, sendMessage } from "../redux/chatSlice";

import socket from "../socket";
const API_URL = process.env.REACT_APP_BASE_URL;


const ChatFooter = () => {
   const dispatch = useDispatch();
   const chatRoomId = useSelector((state) => state.chat.chatRoomId);
   const user = useSelector((state) => state.auth.user);
     

   const [message, setMessage] = useState("");

   useEffect(() => {
     if (chatRoomId) {
       socket.emit("joinRoom", chatRoomId);
       dispatch(fetchMessages(chatRoomId));

       socket.on("receiveMessage", (newMessage) => {
         dispatch(addMessage(newMessage));
       });

       return () => {
         socket.off("receiveMessage");
       };
     }
   }, [chatRoomId, dispatch]);

   const handleSendMessage = () => {
     if (message.trim() === "") return;

     const newMessage = {
       chatRoomId,
       sender: user.userId,
       content: message,
       senderName: user.username,
     };

     dispatch(sendMessage(newMessage));

     socket.emit("sendMessage", newMessage);
     setMessage("");
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
      <button className="btn btn-primary" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatFooter;
