import Client from '../../../api/index'

export const getAllProductsService = async () => {
    try {
        const response = await Client.product.getAll()
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const getProductById = async (params) => {
    try {
        const response = await Client.product.getById(params)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const createProduct = async (data) => {
    try {
        const response = await Client.product.create(data)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateProduct = async (params, data) => {
    try {
        const response = await Client.product.update(params, data)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async (params) => {
    try {
        const response = await Client.product.delete(params)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}