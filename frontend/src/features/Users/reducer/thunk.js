import { getAllUsersService } from "../services"
import { getAllUsers } from "./UserSlice"


export const getAllUsersThunk = () => async (dispatch) => {
    try {
        const response = await getAllUsersService()
        if (response) {
            dispatch(getAllUsers(response?.data?.data))
        }
    } catch (error) {
        console.log(error)
    }
}