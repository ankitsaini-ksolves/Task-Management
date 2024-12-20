import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true" || false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  userId: JSON.parse(localStorage.getItem("userId")) || null,
  User: JSON.parse(localStorage.getItem("User")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user.username;
      state.userId = action.payload.user.userId;
      state.User = action.payload.user;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.user.username)
      );
      localStorage.setItem(
        "userId",
        JSON.stringify(action.payload.user.userId)
      );
      localStorage.setItem("User", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("User");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
