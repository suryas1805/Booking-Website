import { getProfileDetails } from "../services"
import { getProfileData } from "./ProfileSlice"

export const getProfileDetailsThunks = (params) => async (dispatch) => {
    try {
        const response = await getProfileDetails(params)
        if (response) {
            dispatch(getProfileData(response?.data))
        }
    } catch (error) {
        console.log(error)
    }
} 