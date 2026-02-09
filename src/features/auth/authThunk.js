// features/auth/authThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/api/axios";

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth", credentials);
      const { data } = response.data;

      localStorage.setItem("admin_token", data.auth_token);
      localStorage.setItem("admin_user", JSON.stringify(data));

      return response.data;
    } catch (error) {
      // IMPORTANT: forward backend response
      return rejectWithValue(error.response?.data);
    }
  }
);


 export const getProfile = createAsyncThunk(
  "auth/getProfile", 
  async (_, {userId}, { rejectWithValue }) => {
    try {
      
      const response = await axios.get(`user/${userId}/vw`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  });
