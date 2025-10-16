import { createSlice } from "@reduxjs/toolkit"


const BookingSlice = createSlice({
    name: "BookingSlice",
    initialState: {
        data: [],
        userBookings: []
    },
    reducers: {
        getAllBookings: (state, action) => {
            state.data = action.payload
        },
        getAllUserBookings: (state, action) => {
            state.userBookings = action.payload
        }
    }
})

export const { getAllBookings, getAllUserBookings } = BookingSlice.actions
export default BookingSlice.reducer