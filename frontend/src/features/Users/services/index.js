import Client from '../../../api/index'

export const getAllUsersService = async () => {
    try {
        const response = await Client.users.getAllUsers()
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const deleteUserService = async (params) => {
    try {
        const response = await Client.users.deleteUserById(params)
        if (response) return response
    } catch (error) {
        console.log(error)
    }
}