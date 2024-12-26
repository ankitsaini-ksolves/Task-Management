import { shallowEqual, useSelector } from "react-redux";
const API_URL = process.env.REACT_APP_BASE_URL;

const ChatBody = () => {
  const chatRoomId = useSelector((state) => state.chat.chatRoomId);
  const messages = useSelector(
    (state) => state.chat.messages[chatRoomId] || [],
    shallowEqual
  );
  const user= useSelector((state) => state.auth.user);

  return (
    <div className="chat-body p-3">
      <div className="messages scrollable">
        {messages.length > 0 ? (
          messages.map((msg, index) =>
            msg.sender._id ? (
              <div key={index} className="message_chats">
                {msg.sender._id === user.userId ? (
                  <>
                    <p className="mt-3 mb-0 sender_name">You</p>
                    <div className="sender_msg">{msg.content}</div>
                  </>
                ) : (
                  <>
                    <p className="mb-0 mt-3">{msg.sender.username}</p>
                    <div className="recipient_msg">{msg.content}</div>
                  </>
                )}
              </div>
            ) : null
          )
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
