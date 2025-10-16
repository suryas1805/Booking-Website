import Client from '../../../api/index'

export const getAllActivitiesService = async () => {
    try {
        const response = await Client.activity.getAll()
        if (response) return response
    } catch (error) {
        console.log(error)
    }
}

export const getAllByUserActivitiesService = async (params) => {
    try {
        const response = await Client.activity.getByUserId(params)
        if (response) return response
    } catch (error) {
        console.log(error)
    }
}