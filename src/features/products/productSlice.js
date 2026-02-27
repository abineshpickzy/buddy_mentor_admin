import { createSlice } from "@reduxjs/toolkit";
import { createProduct, checkAvailability, listProducts, fetchProductById, deleteBasicNode, deleteProgramNode, updateProduct, addNode, getAssertFiles, viewProductImage, editNode, fetchAssignees } from "./productThunk";

const initialState = {
    currentproduct: [],
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
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // .addCase(checkAvailability.pending, (state) => {
            //     state.loading = true;
            // })
            // .addCase(checkAvailability.fulfilled, (state) => {
            //     state.loading = false;
            // })
            // .addCase(checkAvailability.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.payload;
            // })
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
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;                
            })
            .addCase(fetchProductById.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteBasicNode.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBasicNode.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteBasicNode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteProgramNode.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProgramNode.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteProgramNode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addNode.pending, (state) => {
                state.loading = true;
            })
            .addCase(addNode.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addNode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAssertFiles.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAssertFiles.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(getAssertFiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(viewProductImage.pending, (state) => {
                state.loading = false;
            })
            .addCase(viewProductImage.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(viewProductImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editNode.pending, (state) => {
                state.loading = true;
            })
            .addCase(editNode.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(editNode.rejected, (state, action) => {
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