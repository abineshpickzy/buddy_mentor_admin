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


export const updateProduct = createAsyncThunk("products/updateProduct", async (payload, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.put(`/prd/${payload._id}/ed`, payload);
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