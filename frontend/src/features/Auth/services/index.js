import Client from '../../../api/index'

export const authLogin = async (data) => {
    try {
        const response = await Client.auth.login(data)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

export const authRegister = async (data) => {
    try {
        const response = await Client.auth.register(data)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

export const authLogout = async () => {
    try {
        const response = await Client.auth.logout()
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

export const changePasswordService = async (data) => {
    try {
        const response = await Client.auth.changePassword(data)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
        return error
    }
}
export const emailVerificationService = async (data) => {
    try {
        const response = await Client.auth.emailVerify(data)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
        return error
    }
}
export const otpVerificationService = async (data) => {
    try {
        const response = await Client.auth.otpVerify(data)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

