import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Friends = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user/all-friends/${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [userId]);

  return (
    <>
      <h3 className="text-center">All Friends</h3>
      <ul className="list-group w-100">
        {friends.map((friend) => (
          <div className="list-item">
            <li
              key={friend._id}
              className="d-flex align-items-center mb-2 mt-2"
            >
              <img
                src="/logo192.png"
                alt={friend.username}
                className="rounded-circle me-3"
                width="40"
                height="40"
              />
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div>
                  <span className="fw-bold">{friend.username}</span>
                  <br />
                  <small>{friend.email}</small>
                </div>
                <span className="delete-icon">
                  <i className="mdi mdi-delete mdi-24px mdi-dark"></i>
                </span>
              </div>
            </li>
            <hr className="my-0" />
          </div>
        ))}
      </ul>
    </>
  );
};

export default Friends;
