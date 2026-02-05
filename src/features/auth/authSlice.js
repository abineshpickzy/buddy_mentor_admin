import { createSlice } from "@reduxjs/toolkit";
import { loginAdmin, validateToken } from "./authThunk";
import { bootstrapApp } from "@/features/app/appThunk";

const token = localStorage.getItem("admin_token");
const userData = localStorage.getItem("admin_user");


let parsedUser = null;
if (userData) {
  try {
    parsedUser = JSON.parse(userData);
    console.log("Parsed user data:", parsedUser);
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
}

const initialState = {
  user: parsedUser,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.data.auth_token;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Token validation cases
      .addCase(validateToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user || state.user;
      })
      .addCase(validateToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;