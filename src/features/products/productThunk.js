import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/api/axios";


// Create a new product
export const createProduct = createAsyncThunk("products/createProduct", async (productData, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.post("/prd/create", productData);
        dispatch(listProducts());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

// check available 
export const checkAvailability = createAsyncThunk("products/checkAvailability", async (productName, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/prd/chk`,productName);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// list product 
export const listProducts = createAsyncThunk("products/listProducts", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/prd/list`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
 
// fetch product By Id
export const fetchProductById = createAsyncThunk("products/fetchProductById", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/prd/${id}/vw`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteBasicNode = createAsyncThunk("products/deleteBasicNode", async (nodeId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`prd/basic/${nodeId}/rm`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteProgramNode = createAsyncThunk("products/deleteProgramNode", async (nodeId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`prd/program/${nodeId}/rm`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const updateProduct = createAsyncThunk("products/updateProduct", async ({id,data}, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.put(`/prd/${id}/ed`, data);
        dispatch(listProducts());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// add new node 

export const addNode = createAsyncThunk("products/addNode", async (payload, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.post(`/prd/ad`, payload);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// get Assert Files

export const getAssertFiles = createAsyncThunk("products/getAssertFiles", async ({id,type}, { rejectWithValue }) => {
    try {
        
        const response = await axios.get(`/prd/${id}/lst?type=${type}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// view Product Image
export const viewProductImage = createAsyncThunk(
  "upload/viewProductImage",
  async (payload, { rejectWithValue }) => {
    const { file, width, height } = payload;

    const params = new URLSearchParams();
    params.append("file", file);

    if (width) params.append("width", width);
    if (height) params.append("height", height);

    try {
      const response = await axios.get(
        "prd/img/vw?" + params.toString(),{
          responseType: "blob"
        })
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// edit Node
export const editNode = createAsyncThunk("products/editNode", async (payload, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.put(`prd/${payload.id}/edt`, payload.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});