import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Friends from "../components/Friends";
import ChatBody from "../components/ChatBody";
import ChatFooter from "../components/ChatFooter";
import Users from "../components/Users";
import "../Friends.css";

const FriendsPage = () => {

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-3 d-flex flex-column align-items-center p-3 friends bg-white scrollable">
          <Friends />
        </div>
        <div className="col-md-6 d-flex flex-column chat_main bg-white">
          <ChatBody className="flex-grow-1" />
          <ChatFooter className="mt-2" />
        </div>
        <div className="col-md-3 d-flex flex-column align-items-center p-3 users shadow rounded scrollable">
          <Users />
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
