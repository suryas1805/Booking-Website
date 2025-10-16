import { configureStore } from "@reduxjs/toolkit";
import ProfileReducer from '../features/Profile/reducer/ProfileSlice'
import CategoryReducer from '../features/Category/reducer/CategorySlice'
import BookingReducer from '../features/Booking/reducer/BookingSlice'
import ProductReducer from '../features/Product/reducer/ProductSlice'
import CartReducer from '../features/Carts/reducer/CartSlice'
import UserReducer from '../features/Users/reducer/UserSlice'
import ActivityReducer from '../features/Activity/reducer/ActivitySlice'
import DashboardReducer from '../features/Dashboard/reducers/DashboardSlice'

export const store = configureStore({
    reducer: {
        ProfileReducer: ProfileReducer,
        CategoryReducer: CategoryReducer,
        BookingReducer: BookingReducer,
        ProductReducer: ProductReducer,
        CartReducer: CartReducer,
        UserReducer: UserReducer,
        ActivityReducer: ActivityReducer,
        DashboardReducer: DashboardReducer
    }
})