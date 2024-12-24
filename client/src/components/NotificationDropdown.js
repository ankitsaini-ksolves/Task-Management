import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "../socket";
const API_URL = process.env.REACT_APP_BASE_URL;


const NotificationDropdown = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch friend requests
    socket.emit("joinNotifications", userId);

    // Fetch friend requests on initial load
    fetch(`${API_URL}/user/friend-requests/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
      });

    // Listen for real-time friend requests
    socket.on("receiveFriendRequest", (newRequest) => {
      setRequests((prevRequests) => [...prevRequests, newRequest]);
    });
     return () => {
       socket.off("receiveFriendRequest");
     };
  }, [userId]);

  const handleRequest = (requestId, action) => {
    fetch(`${API_URL}/user/friend-request`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, requestId, action }),
    }).then(() => {
      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
    });

    if (action === "accept")
      toast.success("Request Accepted", { autoClose: 2000 });
    else toast.error("Request Deleted Successfully", { autoClose: 2000 });
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Notifications
      </button>

      <ul className="dropdown-menu">
        {requests.length > 0 ? (
          requests.map((req) => (
            <li key={req._id} className="dropdown-item">
              <span>{req.from.username}</span>
              <button
                className="btn btn-success btn-sm ms-2"
                onClick={() => handleRequest(req._id, "accept")}
              >
                Accept
              </button>
              <button
                className="btn btn-danger btn-sm ms-2"
                onClick={() => handleRequest(req._id, "reject")}
              >
                Reject
              </button>
            </li>
          ))
        ) : (
          <p className=" text-center text-secondary">No Notifications</p>
        )}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
