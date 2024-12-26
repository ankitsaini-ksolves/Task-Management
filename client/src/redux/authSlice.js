import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user.username = action.payload.username || state.user.username;
        state.user.profileImage =
          action.payload.profileImage || state.user.profileImage;
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
