import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/api/axios";
import { bootstrapApp } from "@/features/app/appThunk";

export const validateToken = createAsyncThunk(
  "auth/validateToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/auth/validate");
      return response.data;
    } catch (error) {
      localStorage.removeItem("admin_token");
      return rejectWithValue("Token invalid");
    }
  }
);

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post("/auth", credentials);

      const { data } = response.data;
      
      localStorage.setItem("admin_token", data.auth_token);
      localStorage.setItem("admin_user", JSON.stringify(data));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);