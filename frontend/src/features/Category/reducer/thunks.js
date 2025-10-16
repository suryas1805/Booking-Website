import { getAllCategoriesService } from "../services"
import { getAllCategories } from "./CategorySlice"

export const getAllCategoriesThunk = () => async(dispatch) => {
    try {
        const response = await getAllCategoriesService()
        if(response){
            dispatch(getAllCategories(response?.data?.data))
        }
    } catch (error) {
        console.log(error)
    }
}