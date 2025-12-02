import { ERROR, FAIL, SUCCESS } from "../configs/httpStatus.js"
import { imagekit } from "../configs/imgaekit.js"
import StatusCodes from "../configs/statusCodes.js"
import categoryModel from "../models/category.model.js"

const createCategory = async (req, res) => {
    try {
        const {name, description} = req.body
        if (!name){
            return res.status(StatusCodes.BAD_REQUEST).json({status: FAIL, message: 'please provide category name'})
        }
        const existsCategory = await categoryModel.findOne({name});
        if(existsCategory){
            return res.status(StatusCodes.CONFLICT).json({status: FAIL, message: 'This category aleady exists'});
        };
        const icon = req.file;
        if(!icon){
            return res.status(StatusCodes.BAD_REQUEST).json({status: ERROR, message: 'please provide an icon for the category'})
        }
        const response = await imagekit.upload({
            file: icon.buffer,
            fileName: icon.originalname,
            folder: 'category'
        })
        if(!response){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: FAIL, message: 'error uploading the image'})
        }
        const newCategory = await categoryModel.create({name, description, iconPath:response.url });
        res.status(StatusCodes.OK).json({status: SUCCESS, newCategory})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find().sort({createdAt: -1});
        if(!categories){
            return res.status(StatusCodes.NOT_FOUND).json({status: FAIL, message: 'categories not found'});
        }
        res.status(StatusCodes.OK).json({status: SUCCESS, categories})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id
        const category = await categoryModel.findById(categoryId);
        if(!category){
            return res.status(StatusCodes.NOT_FOUND).json({status: FAIL, message: 'category is not found'})
        }
        res.status(StatusCodes.OK).json({status: SUCCESS, category})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            categoryId,
            req.body,
            {$new: true}
        );
        if(!updatedCategory){
            return res.status(StatusCodes.NOT_FOUND).json({status: FAIL, message: 'Error updating the category'})
        };
        res.status(StatusCodes.OK).json({status: SUCCESS, updatedCategory, message: 'category updated succefully'})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    };
    
}
const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await categoryModel.findByIdAndDelete(categoryId);
        if(!category){
            return res.status(StatusCodes.NOT_FOUND).json({status: ERROR, message: 'This category cannot be found'})
        }
        res.status(StatusCodes.OK).json({status:SUCCESS, message: 'category deleted succefully'})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}