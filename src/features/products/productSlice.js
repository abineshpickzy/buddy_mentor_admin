import { createSlice } from "@reduxjs/toolkit";
import { listProducts, viewProductImage , fetchAssignees} from "./productThunk";

const initialState = {
    products: [],
    productlist: [],
    assignees : [],
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
            })
            .addCase(viewProductImage.pending, (state) => {
                state.loading = true;
            })
            .addCase(viewProductImage.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(viewProductImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAssignees.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAssignees.fulfilled, (state, action) => {
                state.loading = false;
                state.assignees = action.payload.assinee;
            })
            .addCase(fetchAssignees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;