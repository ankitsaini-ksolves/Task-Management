import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { toast } from "react-toastify";
import "../App.css";

import NotificationDropdown from "./NotificationDropdown";
import Modal from "./Modal";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const User = useSelector((state) => state.auth.User);
  const userId = useSelector((state) => state.auth.userId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const openEditModal = () => {
    setShowModal(true);
  };

  const closeEditModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const updatedUser = {
      username: formData.get("username"),
      profileImage: formData.get("profileImage"),
    };
    formData.append("userId", userId);

    try {
      const response = await fetch("http://localhost:5000/api/update", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully!", { autoClose: 2000 });

      closeEditModal();
    } catch (error) {
      toast.error("Error updating profile.", {
        autoClose: 2000,
      });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg primaryColor">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Task-Management
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my-task">
                My Task
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/friends">
                Friends
              </Link>
            </li>
          </ul>
          <p>{User.profileImage}</p>
          <div className="d-flex align-items-center">
            <NotificationDropdown />
            {user && (
              <div className="dropdown">
                <img
                  src={User.profileImage || "/logo192.png"}
                  alt="User Icon"
                  className="rounded-circle m-2"
                  width="40"
                  height="40"
                  style={{ cursor: "pointer" }}
                  onClick={toggleDropdown}
                />
                {showDropdown && (
                  <div className="dropdown-menu dropdown-menu-end show dropdown">
                    <p className="text-center text-old">{user}</p>
                    <button className="dropdown-item" onClick={openEditModal}>
                      Edit Profile
                    </button>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for editing user details */}
      {showModal && (
        <Modal onClose={closeEditModal}>
          <h5>Edit Profile</h5>
          <form onSubmit={handleSaveChanges}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Enter new username"
                defaultValue={user.username}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="profileImage" className="form-label">
                Profile Image
              </label>
              <input
                type="file"
                className="form-control"
                id="profileImage"
                name="profileImage"
                accept="image/*"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </Modal>
      )}
    </nav>
  );
};

export default Navbar;
