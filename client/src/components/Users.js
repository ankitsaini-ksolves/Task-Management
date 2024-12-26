import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "../socket";

const API_URL = process.env.REACT_APP_BASE_URL;

const Users = () => {
    const user = useSelector((state) => state.auth.user);


  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users
    fetch(`${API_URL}/user?userId=${user.userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }, [user.userId]);

  const sendFriendRequest = async (toUserId) => {
    try {
      const response = await fetch(`${API_URL}/user/friend-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUserId: user.userId, toUserId }),
      });

      const result = await response.json();
      const _id = result.result.friendRequests[0]._id;

      if (response.ok) {
        // Emit the friend request notification in real-time
        socket.emit("sendFriendRequest", {
          from: { _id: user.userId, username: user.username },
          toUserId,
          _id,
        });
        toast.success("Request sent Successfully", { autoClose: 2000 });
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== toUserId)
        );
      } else {
        toast.error(result.error, { autoClose: 2000 });
      }
    } catch (err) {
      console.error("Error sending friend request:", err);
    }
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
            src={
              user.profileImage
                ? `${API_URL}${user.profileImage}`
                : "/logo192.png"
            }
            alt={user.username}
            className="rounded-circle me-3"
            width="50"
            height="50"
          />
          <span className="fs-5 flex-grow-1 me-3">{user.username}</span>
          <button
            className="btn btn-sm btn-outline-primary add-friend-btn rounded-pill px-3"
            onClick={() => {
              sendFriendRequest(user._id);
            }}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default Users;
