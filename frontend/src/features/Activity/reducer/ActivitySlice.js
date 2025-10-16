import { createSlice } from "@reduxjs/toolkit";

const ActivitySlice = createSlice({
    name: "ActivitySlice",
    initialState: {
        data: [],
        userData: []
    },
    reducers: {
        getAllActivities: (state, action) => {
            state.data = action.payload
        },
        getUserActivities: (state, action) => {
            state.userData = action.payload
        }
    }
})

export const { getAllActivities, getUserActivities } = ActivitySlice.actions
export default ActivitySlice.reducer