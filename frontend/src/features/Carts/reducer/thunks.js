import { getUserCartService } from "../services"
import { getUserCart } from './CartSlice'

export const getUserCartThunk = (params) => async (dispatch) => {
    try {
        const response = await getUserCartService(params)
        if (response) {
            dispatch(getUserCart(response?.data?.data))
        }
    } catch (error) {
        console.log(error)
    }
}