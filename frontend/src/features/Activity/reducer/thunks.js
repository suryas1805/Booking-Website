import { getAllActivitiesService, getAllByUserActivitiesService } from "../services"
import { getAllActivities, getUserActivities } from "./ActivitySlice"


export const getAllActivitiesThunk = () => async (dispatch) => {
    try {
        const response = await getAllActivitiesService()
        if (response) {
            dispatch(getAllActivities(response?.data?.data))
        }
    } catch (error) {
        console.log(error)
    }
}

export const getAllUserActivitiesThunk = (params) => async (dispatch) => {
    try {
        const response = await getAllByUserActivitiesService(params)
        if (response) {
            dispatch(getUserActivities(response?.data?.data))
        }
    } catch (error) {
        console.log(error)
    }
}