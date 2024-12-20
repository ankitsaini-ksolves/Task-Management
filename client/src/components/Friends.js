import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


const Friends = ({ onSelectFriend }) => {
  const userId = useSelector((state) => state.auth.userId);
  const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState([]);

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

  const handleDeleteFriend = (friendId) => {
    fetch(`http://localhost:5000/user/${friendId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then((response) => response.json())
      .then((updatedFriends) => {
                toast.error("Friend Deleted", { autoClose: 2000 });
        
        setFriends(updatedFriends);
      })
      .catch((error) => console.error("Error deleting friend:", error));
  };

  return (
    <>
      <h3 className="text-center">All Friends</h3>
      <ul className="list-group w-100">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div className="list-item">
              <li
                key={friend._id}
                className="d-flex align-items-center mb-2 mt-2"
                onClick={() => onSelectFriend(friend)}
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
                  <span
                    className="delete-icon"
                    onClick={() => handleDeleteFriend(friend._id)}
                  >
                    <i className="mdi mdi-delete mdi-24px mdi-dark"></i>
                  </span>
                </div>
              </li>
              <hr className="my-0" />
            </div>
          ))
        ) : (
          <div className="text-center mt-4">
            <p className="text-danger">You have no friends</p>
          </div>
        )}
      </ul>
    </>
  );
};

export default Friends;
