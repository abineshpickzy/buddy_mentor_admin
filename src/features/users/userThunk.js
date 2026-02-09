  
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/api/axios";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (filters = {}, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.role) params.append('role', filters.role);
    if (filters.text) params.append('text', filters.text);
    
    const queryString = params.toString();
    const url = queryString ? `/user/view?${queryString}` : '/user/view';
    console.log("fetchUsers called with URL:", url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createUser = createAsyncThunk("users/createUser", async (userData, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post("/user/ad", userData);
    dispatch(fetchUsers());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const editUser = createAsyncThunk("users/editUser", async ({ userId, userData }, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.put(`/user/${userId}/ed`, userData);
    await dispatch(fetchUsers());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


