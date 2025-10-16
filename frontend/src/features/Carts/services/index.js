import Client from '../../../api/index'

export const getUserCartService = async (params) => {
    try {
        const response = await Client.cart.getByUserId(params)
        if (response) return response
    } catch (error) {
        console.log(error)
    }
}

export const addToCartService = async (params, data) => {
    try {
        const response = await Client.cart.create(params, data)
        if (response) return response
    } catch (error) {
        console.log(error)
    }
}

export const updateAddToCartService = async (params, data) => {
    try {
        const response = await Client.cart.update(params, data)
        if (response) return response
    } catch (error) {
        console.log(error)
    }
}

export const RemoveFromCartService = async (params) => {
    try {
        const response = await Client.cart.delete(params)
        if (response) return response
    } catch (error) {
        console.log(error)
    }
}