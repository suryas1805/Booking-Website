import Client from '../../../api/index'

export const getAllBookingsService = async () => {
    try {
        const response = await Client.booking.getAll()
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const getBookingsByUserId = async (params) => {
    try {
        const response = await Client.booking.getByUserId(params)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const createBooking = async (params) => {
    try {
        const response = await Client.booking.create(params)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateBooking = async (params, data) => {
    try {
        const response = await Client.booking.update(params, data)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}
