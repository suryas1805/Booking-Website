import { getAdminReportsService, getUserReportsService } from "../services"
import { getAdminReports, getUserReports } from "./DashboardSlice"


export const getUserReportsThunk = (params) => async (dispatch) => {
    try {
        const response = await getUserReportsService(params)
        if (response) {
            dispatch(getUserReports(response?.data?.data))
        }
    } catch (error) {
        console.log(error)
    }
}

export const getAdminReportsThunk = (params) => async (dispatch) => {
    try {
        const response = await getAdminReportsService(params)
        if (response) {
            dispatch(getAdminReports(response?.data?.data))
        }
    } catch (error) {
        console.log(error)
    }
}