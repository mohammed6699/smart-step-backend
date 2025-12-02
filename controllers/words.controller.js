import { generate3dImageFromText, get3dModel } from '../services/ai.service.js';
import Joi from 'joi';
import StatusCodes from '../configs/statusCodes.js';
import { ERROR, FAIL, SUCCESS } from '../configs/httpStatus.js';
import wordsModel from '../models/word.model.js';
import { imagekit } from '../configs/imgaekit.js';
import categoryModel from '../models/category.model.js';

const schema = Joi.object({
    name: Joi.string().required().trim().lowercase(),
    category: Joi.string().required()
})

const addNewWord = async (req, res) =>{
    try {
        const {name, category} = req.body;
        if(!name){
            return res.status(StatusCodes.BAD_REQUEST).json({status: FAIL, message: 'word is required'})
        };
        // check if the words exists ex.lion => lion
        const existsWord = await wordsModel.findOne({name: name.toLowerCase()});
        if(existsWord){
            return res.status(StatusCodes.CONFLICT).json({status: ERROR, message: 'This word already exists'})
        };
        // check the category
        if(category){
            const validCatehory = await categoryModel.findById(category)
            if(!validCatehory){
                return res.status(StatusCodes.NOT_FOUND).json({status: ERROR, message: 'This category is not found'})
            }
        }
        const icon = req.file;
        if(!icon){
            return res.status(StatusCodes.BAD_REQUEST).json({status: ERROR, message: 'Image is required'})
        };
        const response = await imagekit.upload({
            file:icon.buffer,
            fileName: icon.originalname,
            folder: 'words'
        });
        if(!response){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: 'Error uploading the image'})
        };
        const newWord = await wordsModel.create({
            name: name.toLowerCase(), category: category, imagePath:response.url
        });
        res.status(StatusCodes.OK).json({status: SUCCESS, newWord, message: 'new word added'})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
const getAllWords = async (req, res) => {
    try {
        const words = await wordsModel.find().populate('category');
        if(!words){
            return res.status(StatusCodes.NOT_FOUND).json({status: FAIL, message: 'Error finding words'});
        }
        res.status(StatusCodes.OK).json({status:SUCCESS, words})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
const getWordById = async (req, res) => {
    try {
        const wordId = req.params.id;
        const word = await wordsModel.findOne({_id: wordId}).populate('category');
        if(!word){
            return res.status(StatusCodes.NOT_FOUND).json({status: FAIL, message: 'This word is not exists'})
        }
        res.status(StatusCodes.OK).json({status:SUCCESS, word})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
// create this function to connect the 3d model in the future
// const getWordsByName = async (req, res) => {
//     try {
//         let wordName = req.params.name;
//         wordName = wordName.toLowerCase()
//         const word = await wordsModel.findOne({name: wordName}).populate('category');
//         if(!word){
//             return res.status(StatusCodes.NOT_FOUND).json({status: FAIL, message: 'word is not found'})
//         };
//         if(word.model3DPath === null){
//             try {
//                 const taskId = await generate3dImageFromText(word.name);
//                 if (!taskId) {
//                     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: 'Failed to generate 3D model task.'})
//                 }
//                 let model = await get3dModel(taskId);
//                 while(model && model.status !== 'SUCCEEDED'){
//                     if (model.status === 'FAILED') {
//                         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: '3D model generation failed.'})
//                     }
//                     await new Promise(resolve => setTimeout(resolve, 5000));
//                     model = await get3dModel(taskId);
//                 }
//                 word.model3DPath = model.model_url;
//                 await word.save()
//             } catch (error) {
//                 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: 'An error occurred during 3D model generation.'})
//             }
//         }
//         res.status(StatusCodes.OK).json({status:SUCCESS, word})
//     } catch (error) {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
//     }
// }

// create as a first step to continue testing as find the image path

const getWordsByName = async (req, res) => {
    try {
        let wordName = req.params.name;
        wordName = wordName.toLowerCase()
        const word = await wordsModel.findOne({name: wordName}).populate('category');
        if(!word){
            return res.status(StatusCodes.NOT_FOUND).json({status: FAIL, message: 'word is not found'})
        };       
        res.status(StatusCodes.OK).json({status:SUCCESS, word})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
const updateWord = async (req, res) => {
    try {
        const wordId = req.params.id;
        const updatedWord = await wordsModel.findByIdAndUpdate(
            wordId,
            req.body,
            {$new:true}
        );
        if(!updatedWord){
            return res.status(StatusCodes.NOT_FOUND).json({status: ERROR, message: 'Error updating the word'})
        }
        res.status(StatusCodes.OK).json({status:SUCCESS, updatedWord})

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
const deleteWord = async (req, res) => {
    try {
        const wordId = req.params.id;
        const deletedWord = await wordsModel.findByIdAndDelete(wordId);
        if (!deletedWord){
            return res.status(StatusCodes.NOT_FOUND).json({status: FAIL, message: 'word not found'})
        };
        res.status(StatusCodes.OK).json({status:SUCCESS, message: 'word deleted succefully'})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
export {
    addNewWord,
    getAllWords,
    getWordById,
    getWordsByName,
    updateWord,
    deleteWord
}