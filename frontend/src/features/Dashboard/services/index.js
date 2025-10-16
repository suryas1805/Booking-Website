import Client from '../../../api/index'

export const getUserReportsService = async (params) => {
    try {
        const response = await Client.reports.getUser(params)
        if (response) return response
    } catch (error) {
        console.log(error)
    }
}

export const getAdminReportsService = async (params) => {
    try {
        const response = await Client.reports.getAdmin(params)
        if (response) return response
    } catch (error) {
        console.log(error)
    }
}