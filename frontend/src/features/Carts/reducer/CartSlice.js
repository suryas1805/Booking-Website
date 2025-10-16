import { createSlice } from "@reduxjs/toolkit"


const CartSlice = createSlice({
    name: "CartSlice",
    initialState: {
        data: []
    },
    reducers: {
        getUserCart: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { getUserCart } = CartSlice.actions
export default CartSlice.reducer