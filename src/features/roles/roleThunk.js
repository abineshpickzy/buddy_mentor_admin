 import { createAsyncThunk } from "@reduxjs/toolkit";
 import axios from "@/api/axios";


  export const fetchRoles = createAsyncThunk(
    "roles/fetchRoles",
    async (_, { rejectWithValue }) => { 
      try {
        const response = await axios.get("/role/view");
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );


  export const fetchRoleList = createAsyncThunk(
    "roles/fetchRoleList",
    async (_, { rejectWithValue }) => { 
      try {
        const response = await axios.get("/role/list");
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const createRole = createAsyncThunk(
    "roles/createRole",
    async (roleData, { dispatch, rejectWithValue }) => {
      try {
        const response = await axios.post("/role/ad", roleData);
          dispatch(fetchRoles());
          dispatch(fetchRoleList());
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const updateRole = createAsyncThunk(
    "roles/updateRole",
    async ({ roleId, roleData }, { dispatch, rejectWithValue }) => {

      try {
        console.log("Updating role with ID:", roleId, "Data:", roleData);
        const response = await axios.put(`/role/${roleId}/ed`, roleData);
        dispatch(fetchRoles());
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

   export const deleteRole = createAsyncThunk(
    "roles/deleteRole",
    async (roleId, { rejectWithValue }) => {  
      try {
        const response = await axios.delete(`/role/${roleId}/del`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

/* ------------------ PRIVILEGES STRUCTURE ------------------ */

export const defaultPrivilegesStructure = createAsyncThunk(
  "roles/defaultPrivilegesStructure",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/role/prv/vw");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ------------------ unassignd admins ------------------ //
  
export const unassignAdminsFromRole = createAsyncThunk(
  "roles/unassignAdminsFromRole",
  async ({ roleId, users }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`/role/${roleId}/usr/unasgn`, { users });
      dispatch(fetchRoles());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ------------------ assign admins ------------------ //

export const assignAdminsToRole = createAsyncThunk(
  "roles/assignAdminsToRole",
  async ({ roleId, users }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`/role/${roleId}/usr/asgn`, { users });
      dispatch(fetchRoles());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);