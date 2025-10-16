import httpClient from "./httpClient";
import httpEndPoints from "./httpEndPoints";

class Client {
    auth = {
        login: async (data) => httpClient.post(httpEndPoints.login, data),
        register: async (data) => httpClient.post(httpEndPoints.register, data),
        logout: async () => httpClient.post(httpEndPoints.logout),
        changePassword: async (data) => httpClient.put(httpEndPoints.changePassword, data)
    }
    users = {
        getAllUsers: async () => httpClient.get(httpEndPoints.getAllUsers),
        getUserById: async (params) => httpClient.get(httpEndPoints.getUserById.replace(":userId", params.userId)),
        updateUserById: async (params, data) => httpClient.uploadPut(httpEndPoints.updateUserById.replace(":userId", params.userId), data),
        deleteUserById: async (params) => httpClient.delete(httpEndPoints.deleteUserById.replace(":userId", params.userId)),
    }
    category = {
        getAll: async () => httpClient.get(httpEndPoints.category.getAll),
        getById: async (params) => httpClient.get(httpEndPoints.category.getById.replace(":categoryId", params?.categoryId)),
        create: async (data) => httpClient.post(httpEndPoints.category.create, data),
        update: async (params, data) => httpClient.put(httpEndPoints.category.update.replace(":categoryId", params?.categoryId), data),
        delete: async (params) => httpClient.delete(httpEndPoints.category.delete.replace(":categoryId", params?.categoryId))
    }
    product = {
        getAll: async () => httpClient.get(httpEndPoints.product.getAll),
        getById: async (params) => httpClient.get(httpEndPoints.product.getById.replace(":productId", params?.productId)),
        create: async (data) => httpClient.uploadPost(httpEndPoints.product.create, data),
        update: async (params, data) => httpClient.uploadPut(httpEndPoints.product.update.replace(":productId", params?.productId), data),
        delete: async (params) => httpClient.delete(httpEndPoints.product.delete.replace(":productId", params?.productId))
    }
    booking = {
        getAll: async () => httpClient.get(httpEndPoints.booking.getAll),
        getByUserId: async (params) => httpClient.get(httpEndPoints.booking.getByUserId.replace(":userId", params?.userId)),
        create: async (params) => httpClient.post(httpEndPoints.booking.create.replace(":userId", params?.userId)),
        update: async (params, data) => httpClient.put(httpEndPoints.booking.update.replace(":bookingId", params?.bookingId), data),
    }
    cart = {
        getByUserId: async (params) => httpClient.get(httpEndPoints.cart.getByUserId.replace(":userId", params?.userId)),
        create: async (params, data) => httpClient.post(httpEndPoints.cart.create.replace(":userId", params?.userId), data),
        update: async (params, data) => httpClient.post(httpEndPoints.cart.update.replace(":userId", params?.userId), data),
        delete: async (params) => httpClient.delete(httpEndPoints.cart.delete.replace(":userId", params?.userId).replace(":productId", params?.productId))
    }
    activity = {
        getAll: async () => httpClient.get(httpEndPoints.activity.getAll),
        getByUserId: async (params) => httpClient.get(httpEndPoints.activity.getByUserId.replace(":userId", params?.userId))
    }
    reports = {
        getUser: async (params) => httpClient.get(httpEndPoints.reports.getUser.replace(':userId', params?.userId)),
        getAdmin: async (params) => httpClient.get(httpEndPoints.reports.getAdmin.replace(':adminId', params?.adminId))
    }
}

export default new Client();