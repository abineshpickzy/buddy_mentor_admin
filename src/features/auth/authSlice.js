// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loginAdmin } from "./authThunk";

const token = localStorage.getItem("admin_token");
const userData = localStorage.getItem("admin_user");

const initialState = {
  user: userData ? JSON.parse(userData) : null,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
  captchaRequired: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.captchaRequired = false;
      localStorage.clear();
    },

    updateUserProduct(state, action) {
      state.user.product = action.payload;
      localStorage.setItem("admin_user", JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.data.auth_token;
        state.isAuthenticated = true;
        state.captchaRequired = false;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";

        if (action.payload?.captchaRequired === true) {
          state.captchaRequired = true;
        }
      });
  },
});

export const { logout, updateUserProduct } = authSlice.actions;
export default authSlice.reducer;
