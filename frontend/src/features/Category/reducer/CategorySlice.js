import { createSlice } from "@reduxjs/toolkit"


const CategorySlice = createSlice({
    name: "CategorySlice",
    initialState: {
        data: []
    },
    reducers: {
        getAllCategories: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { getAllCategories } = CategorySlice.actions
export default CategorySlice.reducer