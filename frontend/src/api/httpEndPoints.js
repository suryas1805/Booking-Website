
const httpEndPoints = {
    login: '/auth/login',
    register: '/auth/register',
    getAllUsers: '/auth/users',
    getUserById: `/auth/user/:userId`,
    updateUserById: `/auth/user/:userId`,
    deleteUserById: `/auth/user/:userId`,
    logout: '/auth/logout',
    changePassword: '/auth/change-password/',
    category: {
        getAll: '/category/getAll',
        getById: '/category/get/:categoryId',
        create: '/category/create',
        update: '/category/update/:categoryId',
        delete: '/category/delete/:categoryId'
    },
    product: {
        getAll: '/product/getAll',
        getById: '/product/get/:productId',
        create: '/product/create',
        update: '/product/update/:productId',
        delete: '/product/delete/:productId'
    },
    booking: {
        getAll: '/booking/getAll',
        getByUserId: '/booking/getAll/:userId',
        create: '/booking/:userId',
        update: '/booking/update/:bookingId',
    },
    cart: {
        getByUserId: '/cart/:userId',
        create: '/cart/:userId',
        update: '/cart/:userId',
        delete: '/cart/:userId/:productId'
    },
    activity: {
        getAll: '/activity',
        getByUserId: '/activity/:userId'
    },
    reports: {
        getUser: '/reports/user/:userId',
        getAdmin: '/reports/admin/:adminId'
    }
}

export default httpEndPoints;