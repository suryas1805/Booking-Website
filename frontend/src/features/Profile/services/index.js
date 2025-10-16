import Client from '../../../api/index'

export const getProfileDetails = async (params) => {
    try {
        const response = await Client.users.getUserById(params)
        if (response) return response
    } catch (error) {
        console.log(error)
    }
}

export const updateProfileDetails = async (params, data) => {
    try {
        const response = await Client.users.updateUserById(params, data)
        if (response) return response
    } catch (error) {
        console.log(error)
    }
}

