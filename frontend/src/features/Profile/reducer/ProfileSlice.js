import { createSlice } from "@reduxjs/toolkit";

const ProfileSlice = createSlice({
    name: "ProfileSlice",
    initialState: {
        data: []
    },
    reducers: {
        getProfileData: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { getProfileData } = ProfileSlice.actions
export default ProfileSlice.reducer