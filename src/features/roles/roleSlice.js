import { createSlice } from "@reduxjs/toolkit";
import { fetchRoles, fetchRoleList, defaultPrivilegesStructure, createRole, updateRole, deleteRole, unassignAdminsFromRole, assignAdminsToRole } from "./roleThunk";

const initialState = {
  roles: [],
  rolelist:[],
  defaultPrvillages: [],
  activeRole: null,
  isLoading: false,
  error: null,
};  

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
    },
  },
    extraReducers: (builder) => {
      builder
        .addCase(fetchRoles.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchRoles.fulfilled, (state, action) => {
          state.isLoading = false;
          state.roles = action.payload.roles;
          
          // Update activeRole with fresh data if it exists
          if (state.activeRole) {
            const updatedActiveRole = action.payload.roles.find(
              role => role._id === state.activeRole._id
            );
            if (updatedActiveRole) {
              state.activeRole = updatedActiveRole;
            }
          }
          
          // Set first role as active if none selected
          if (!state.activeRole && action.payload.roles?.length > 0) {
            state.activeRole = action.payload.roles[0];
          }
        })
        .addCase(fetchRoles.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })

        .addCase(fetchRoleList.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchRoleList.fulfilled, (state, action) => {
          state.isLoading = false;
          state.rolelist = action.payload.roles;
        })
        .addCase(fetchRoleList.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        .addCase(defaultPrivilegesStructure.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(defaultPrivilegesStructure.fulfilled, (state, action) => {
          state.isLoading = false;
          state.defaultPrvillages = action.payload.privileges;
        })
        .addCase(defaultPrivilegesStructure.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        .addCase(createRole.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(createRole.fulfilled, (state) => {
          state.isLoading = false;
        })
        .addCase(createRole.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        .addCase(updateRole.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateRole.fulfilled, (state) => {
          state.isLoading = false;
        })
        .addCase(updateRole.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        .addCase(deleteRole.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteRole.fulfilled, (state) => {
          state.isLoading = false;
        })
        .addCase(deleteRole.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        .addCase(unassignAdminsFromRole.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(unassignAdminsFromRole.fulfilled, (state) => {
          state.isLoading = false;
        })
        .addCase(unassignAdminsFromRole.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        .addCase(assignAdminsToRole.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(assignAdminsToRole.fulfilled, (state) => {
          state.isLoading = false;
        })
        .addCase(assignAdminsToRole.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        });
}
});

export const { setActiveRole } = roleSlice.actions;
export default roleSlice.reducer;
            