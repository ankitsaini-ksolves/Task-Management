import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import "../App.css";

import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
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
          <div className="d-flex align-items-center">
            <NotificationDropdown />
            {user && (
              <>
                <img
                  src="/logo192.png"
                  alt="User Icon"
                  className="rounded-circle"
                  width="40"
                  height="40"
                  style={{ marginRight: "10px" }}
                />
                <span className="me-3">Welcome, {user}</span>
                <div>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
