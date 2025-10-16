import Client from '../../../api/index'

export const getAllCategoriesService = async () => {
    try {
        const response = await Client.category.getAll()
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const getCategoryById = async (params) => {
    try {
        const response = await Client.category.getById(params)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const createCategory = async (data) => {
    try {
        const response = await Client.category.create(data)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateCategory = async (params, data) => {
    try {
        const response = await Client.category.update(params, data)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const deleteCategory = async (params) => {
    try {
        const response = await Client.category.delete(params)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}