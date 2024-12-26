import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "../App.css";
const API_URL = process.env.REACT_APP_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      const decoded = jwtDecode(token);

      dispatch(login({ user: decoded }));

      localStorage.setItem("token", token);

      navigate("/");
      toast.success("Logged In Successfully", { autoClose: 2000 });
    } else {
      const data = await response.json();
      setError(data.message || "Invalid Credentials");
    }
  } catch (error) {
    setError("An error occurred. Please try again.");
  }
};


  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="d-flex flex-row rounded-4 shadow-lg bg-white"
        style={{ maxWidth: "800px", height: "500px" }}
      >
        <div
          className="d-flex align-items-center justify-content-center p-4"
          style={{ flex: 1 }}
        >
          <img
            src="/images/login.jpg"
            alt="Login Illustration"
            className="img-fluid rounded-4 w-90"
            style={{ height: "320px" }}
          />
        </div>
        <div className="p-5" style={{ flex: 1 }}>
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="alert alert-danger p-2 mb-2">{error}</div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <div className="text-center mt-5">
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
