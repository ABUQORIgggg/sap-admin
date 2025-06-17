import { createSlice } from "@reduxjs/toolkit";

// Инициализация состояния из localStorage
const initialState = {
  isAuthenticated: Boolean(localStorage.getItem("token")),
  user: {
    id: localStorage.getItem("id") || null,
    username: localStorage.getItem("username") || null,
    token: localStorage.getItem("token") || null,
  },
};

// Слайс аутентификации
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = false;
      state.user = action.payload;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("id", action.payload.id);
      localStorage.setItem("username", action.payload.username);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("username");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
