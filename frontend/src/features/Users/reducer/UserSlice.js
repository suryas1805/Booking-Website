import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name: 'UserSlice',
    initialState: {
        users: []
    },
    reducers: {
        getAllUsers: (state, action) => {
            state.users = action.payload
        }
    }
})

export const { getAllUsers } = UserSlice.actions
export default UserSlice.reducer