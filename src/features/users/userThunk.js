  
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

export const fetchUser = createAsyncThunk("users/fetchUser", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/user/${userId}/vw`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
})

export const createUser = createAsyncThunk("users/createUser", async (userData, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post("/user/ad", userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const editUser = createAsyncThunk("users/editUser", async ({ userId, userData }, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.put(`/user/${userId}/ed`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});



export const getUserLocation = createAsyncThunk("users/getNewUserLocation", async ({id,country, state, city}, { rejectWithValue }) => {
  const params = new URLSearchParams();
  
  if (country) params.append('country', country);
  if (state) params.append('state', state);
  if (city) params.append('city', city);
  
  const queryString = params.toString();
  const url = queryString ? `/user/${id}/loc/vw?${queryString}` : `/user/${id}/loc/vw`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


export const viewUserImage = createAsyncThunk(
  "upload/viewUserImage",
  async (payload, { rejectWithValue }) => {
    const { file, width, height } = payload;

    const params = new URLSearchParams();
    params.append("file", file);

    if (width) params.append("width", width);
    if (height) params.append("height", height);

    try {
      const response = await axios.get(
        "user/img/vw?" + params.toString(),{
          responseType: "blob"
        })
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const checkUserEmail = createAsyncThunk("users/checkUserEmail", async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post("/user/chk", { qry: email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});