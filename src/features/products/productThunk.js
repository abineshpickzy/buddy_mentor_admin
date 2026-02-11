import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/api/axios";

// Fetch products
export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/product/view");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

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