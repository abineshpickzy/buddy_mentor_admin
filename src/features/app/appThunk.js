import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers } from "@/features/users/userThunk";
import { fetchRoles,fetchRoleList,defaultPrivilegesStructure } from "@/features/roles/roleThunk";
// import { validateToken } from "@/features/auth/authThunk";

export const bootstrapApp = createAsyncThunk(
  "app/bootstrap",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
     
       console.log("Bootstrapping app...");
      
      const { auth } = getState();
       console.log("Current auth state:", auth.user);
      // If token exists, validate it in background and fetch data
      if (auth.token) {
        // Fetch multiple data sources
        await Promise.all([
         
          dispatch(fetchUsers()).unwrap(),
          dispatch(fetchRoles()).unwrap(),
          dispatch(fetchRoleList()).unwrap(),
          dispatch(defaultPrivilegesStructure()).unwrap(),
        ]);
      }
      
      return { bootstrapped: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);