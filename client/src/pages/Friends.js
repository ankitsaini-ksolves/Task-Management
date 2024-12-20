import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Friends from "../components/Friends";
import ChatBody from "../components/ChatBody";
import ChatFooter from "../components/ChatFooter";
import Users from "../components/Users";
import "../Friends.css";

const FriendsPage = () => {

  const userId = useSelector((state) => state.auth.userId); // Logged-in user
  const [selectedFriend, setSelectedFriend] = useState(null); // Track selected friend

  const chatRoomId = selectedFriend
    ? [userId, selectedFriend._id].sort().join("_")
    : null;

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-3 d-flex flex-column align-items-center p-3 friends bg-white scrollable">
          <Friends onSelectFriend={(friend) => setSelectedFriend(friend)} />
        </div>
        <div className="col-md-6 d-flex flex-column chat_main bg-white mt-2">
          {selectedFriend ? (
            <>
              <ChatBody chatRoomId={chatRoomId} friend={selectedFriend} />
              <ChatFooter chatRoomId={chatRoomId} />
            </>
          ) : (
            <p className="text-center mt-3">
              Select a friend to start chatting!
            </p>
          )}
        </div>
        <div className="col-md-3 d-flex flex-column align-items-center p-3 users shadow rounded scrollable">
          <Users />
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
