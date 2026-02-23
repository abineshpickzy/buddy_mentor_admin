import { createSlice } from "@reduxjs/toolkit";
import { createUser, fetchUsers, editUser, fetchUser, viewUserImage, getUserLocation, checkUserEmail } from "./userThunk";

const initialState = {
  users: [],
  loading: false,
  error: null,
  initialFetchDone: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
       

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.initialFetchDone = true;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state) => {
        state.loading = false;  
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(viewUserImage.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(viewUserImage.fulfilled, (state) => {
      //   state.loading = false;
      // })
      .addCase(viewUserImage.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserLocation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      // .addCase(checkUserEmail.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(checkUserEmail.fulfilled, (state) => {
      //   state.loading = false;
      // })
      // .addCase(checkUserEmail.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // });
  },
});

export default userSlice.reducer;
