import { getAllBookingsService, getBookingsByUserId } from "../services"
import { getAllBookings, getAllUserBookings } from "./BookingSlice"

export const getAllBookingsThunks = () => async (dispatch) => {
    try {
        const response = await getAllBookingsService()
        if (response) {
            dispatch(getAllBookings(response?.data?.data))
        }
    } catch (error) {
        console.log(error)
    }
}

export const getAllBookingsByUserIdThunks = (params) => async (dispatch) => {
    try {
        const response = await getBookingsByUserId(params)
        if (response) {
            dispatch(getAllUserBookings(response?.data?.data))
        }
    } catch (error) {
        console.log(error)
    }
}