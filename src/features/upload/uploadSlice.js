import { createSlice, current } from "@reduxjs/toolkit";
import { uploadFile, saveVideoFile, cancelUpload, saveAssert, previewFile, replaceAssetFile } from "./uploadThunk";

const initialState = {
  currentFiles: [],
  loading: false,
  error: null,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    addFile: (state, action) => {
      state.currentFiles.push(action.payload);
    },
    setStatus: (state, action) => {
      const { uid, status, progress } = action.payload;
      const file = state.currentFiles.find((file) => file.uid === uid);
      if (file) {
        file.status = status;
        file.progress = progress;
      }

    },
    deleteFile: (state, action) => {
      const { uid } = action.payload;
      state.currentFiles = state.currentFiles.filter((file) => file.uid !== uid);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveVideoFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveVideoFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveVideoFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelUpload.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelUpload.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelUpload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveAssert.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveAssert.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveAssert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(previewFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(previewFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(previewFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(replaceAssetFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(replaceAssetFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(replaceAssetFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addFile, deleteFile, setStatus } = uploadSlice.actions;

export default uploadSlice.reducer;