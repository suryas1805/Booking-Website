import { getAllProductsService, getProductById } from "../services"
import { getAllProducts, getSingleProduct } from "./ProductSlice"

export const getAllProductsThunk = () => async (dispatch) => {
    try {
        const response = await getAllProductsService()
        if (response) {
            dispatch(getAllProducts(response?.data?.data))
        }
    } catch (error) {
        console.log(error)
    }
}

export const getSingleProductThunk = (params) => async (dispatch) => {
    try {
        const response = await getProductById(params)
        if (response) {
            dispatch(getSingleProduct(response?.data?.data))
        }
    } catch (error) {
        console.log(error)
    }
}