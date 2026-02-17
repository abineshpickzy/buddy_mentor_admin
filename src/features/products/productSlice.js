import { createSlice } from "@reduxjs/toolkit";
import {  listProducts } from "./productThunk";

const initialState = {
    products: [],
    productlist: [],
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(listProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.productlist = action.payload.data;
            })
            .addCase(listProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;