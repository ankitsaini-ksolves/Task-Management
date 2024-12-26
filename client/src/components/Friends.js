import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setSelectedFriend, setChatRoom, fetchMessages} from "../redux/chatSlice"
const API_URL = process.env.REACT_APP_BASE_URL;

const Friends = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user.userId);
  const [friends, setFriends] = useState([]);


    useEffect(() => {
      return () => {
        dispatch(setSelectedFriend(null));
      };
    }, [dispatch]);


  const onSelectFriend = (friendId) => {
    if (friendId) {
      fetch(`${API_URL}/chat/chat-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user1: userId, user2: friendId }),
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch(setChatRoom(data.chatRoomId));
        });

      dispatch(setSelectedFriend(friendId));
      dispatch(fetchMessages(friendId));
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`${API_URL}/user/all-friends/${userId}`);
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
    fetch(`${API_URL}/user/${friendId}`, {
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
            <div className="list-item" key={friend._id}>
              <li
                className="d-flex align-items-center mb-2 mt-2"
                onClick={() => onSelectFriend(friend._id)}
              >
                <img
                  src={
                    friend.profileImage
                      ? `${API_URL}${friend.profileImage}`
                      : "/logo192.png"
                  }
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
