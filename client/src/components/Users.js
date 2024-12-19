import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");


const Users = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users
    fetch(`http://localhost:5000/user?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [userId]);



  const sendFriendRequest = (toUserId) => {
    fetch("http://localhost:5000/user/friend-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUserId: userId, toUserId }),
    });

    socket.emit("send-friend-request", { toUserId });
  };

  return (
    <div className="users-list p-1">
      <h3 className="text-center">Users</h3>
      {users.map((user) => (
        <div
          key={user._id}
          className="user-item d-flex align-items-center ps-4 p-3 mb-2 border bg-white rounded"
        >
          <img
            src="/logo192.png"
            alt={user.username}
            className="rounded-circle me-3"
            width="50"
            height="50"
          />
          <span className="fs-5 flex-grow-1 me-3">{user.username}</span>
          <button className="btn btn-sm btn-outline-primary add-friend-btn rounded-pill px-3" onClick={()=>{sendFriendRequest(user._id);}}>
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default Users;
