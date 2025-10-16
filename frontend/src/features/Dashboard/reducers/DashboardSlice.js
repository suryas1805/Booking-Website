import { createSlice } from "@reduxjs/toolkit";

const DashboardSlice = createSlice({
    name: 'DashboardSlice',
    initialState: {
        userData: [],
        adminData: []
    },
    reducers: {
        getUserReports: (state, action) => {
            state.userData = action.payload
        },
        getAdminReports: (state, action) => {
            state.adminData = action.payload
        }
    }
})

export const { getUserReports, getAdminReports } = DashboardSlice.actions
export default DashboardSlice.reducer