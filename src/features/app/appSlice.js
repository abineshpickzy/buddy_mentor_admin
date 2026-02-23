import { createSlice } from "@reduxjs/toolkit";
import { bootstrapApp } from "./appThunk";

const initialState = {
  isBootstrapping: false,
  isBootstrapped: false,
  bootstrapFailed: false,
  error: null,
  loading: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetBootstrap: (state) => {
      state.isBootstrapped = false;
      state.isBootstrapping = false;
      state.bootstrapFailed = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapApp.pending, (state) => {
        state.loading = true;
        state.isBootstrapping = true;
        state.error = null;
      })
      .addCase(bootstrapApp.fulfilled, (state) => {
        state.isBootstrapping = false;
        state.isBootstrapped = true;
        state.loading=false;
      })
      .addCase(bootstrapApp.rejected, (state, action) => {
        state.isBootstrapped = false;
        state.isBootstrapping = false;
        state.bootstrapFailed = true;
        state.error = action.payload;
        state.loading=false;
      });
  },
});

export const { resetBootstrap } = appSlice.actions;
export default appSlice.reducer;