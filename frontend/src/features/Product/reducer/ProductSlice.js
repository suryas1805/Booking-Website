import { createSlice } from "@reduxjs/toolkit"

const ProductSlice = createSlice({
    name: "ProductSlice",
    initialState: {
        data: [],
        singleProduct: []
    },
    reducers: {
        getAllProducts: (state, action) => {
            state.data = action.payload
        },
        getSingleProduct: (state, action) => {
            state.singleProduct = action.payload
        }
    }
})

export const { getAllProducts, getSingleProduct } = ProductSlice.actions
export default ProductSlice.reducer