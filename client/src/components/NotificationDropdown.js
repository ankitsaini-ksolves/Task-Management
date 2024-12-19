import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const NotificationDropdown = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch friend requests
    fetch(`http://localhost:5000/user/friend-requests/${userId}`)
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, [userId]);

  const handleRequest = (requestId, action) => {
    fetch("http://localhost:5000/user/friend-request", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, requestId, action }),
    }).then(() => {
      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
    });
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
        {requests.map((req) => (
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
        ))}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
