import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./components/Navbar";
import MyTask from "./pages/MyTask";
import Friends from "./pages/Friends";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { login } from "./redux/authSlice";


function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
        } else {
          dispatch(login({ user: decoded }));
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    setLoading(false);
  }, [dispatch]);

    if (loading) {
      return <div>Loading...</div>;
    }

  return (
    <div className="App">
      <Router>
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-task"
            element={
              <ProtectedRoute>
                <MyTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
