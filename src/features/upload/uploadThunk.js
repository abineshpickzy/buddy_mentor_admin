import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "@/api/axios";


// upload file
export const uploadFile = createAsyncThunk(
  "upload/uploadFile",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/vdo/init", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

//  save video file
export const saveVideoFile = createAsyncThunk(
  "upload/saveVideoFile",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/ast/vdo/sv", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

//  save ssert file
export const saveAssert = createAsyncThunk(
  "upload/saveAssert",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post("/ast/file/sv", formdata);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)


//  cancel upload
export const cancelUpload = createAsyncThunk(
  "upload/cancelUpload",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/vdo/cncl", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

// preview file

export const previewFile = createAsyncThunk(
  "upload/previewFile",
  async (payload, { rejectWithValue }) => {
    const { file, type, width, height } = payload;

    const params = new URLSearchParams();
    params.append("file", file);
    params.append("type", type);
    if (width) params.append("width", width);
    if (height) params.append("height", height);

    try {
      const response = await axios.get(
        "/ast/pvw/?" + params.toString(),{
          responseType: "blob"
        })
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
