import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!localStorage.getItem("token"), // Set to true if token exists
  user: {
    id: localStorage.getItem("id") || null,
    username: localStorage.getItem("username") || null,
    token: localStorage.getItem("token") || null,
    refresh: localStorage.getItem("refresh_token") || null,
  },
};

// Authentication slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refresh_token", action.payload.refresh);
      localStorage.setItem("id", action.payload.id);
      localStorage.setItem("username", action.payload.username);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {
        id: null,
        username: null,
        token: null,
        refresh: null,
      };

      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("id");
      localStorage.removeItem("username");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;