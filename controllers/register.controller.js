import Joi from "joi";
import userRole from "../configs/user.role.js";
import userModel from "../models/user.model.js";
import StatusCodes from "../configs/statusCodes.js";
import { ERROR, FAIL, SUCCESS } from "../configs/httpStatus.js";
import { imagekit } from "../configs/imgaekit.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const schema = Joi.object({
    firstname: Joi.string().max(30).required(),
    lastname: Joi.string().max(30).required(),
    email: Joi.string().required(),
    username: Joi.string().min(8).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid(userRole.USER, userRole.ADMIN).default(userRole.USER)
})
const signupUser = async (req, res) => {
    try {
        const payload = await schema.validateAsync(req.body);
        const existsUser = await userModel.find({
            $or: [{email: payload.email}, {username: payload.username}]
        });
        if(existsUser.length > 0){
            return res.status(StatusCodes.CONFLICT).json({status: FAIL, message: 'username or email already exists'});
        }
        const media = req.file;
        const response = await imagekit.upload({
            file: media.buffer,
            fileName: media.originalname,
            folder: 'users'
        })
        if(!response){
            return res.status(StatusCodes.BAD_REQUEST).json({status: FAIL, message: 'error uploading the image'})
        }
        const newUser = await userModel.create({
            ...payload,
            media: response.url
        });
        res.status(StatusCodes.OK).json({status: SUCCESS, newUser})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
const signinUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(StatusCodes.UNAUTHORIZED).json({status:FAIL, message: 'Authentication Error'})
        };
        const enteredPaswword = await bcrypt.compare(password, user.password);
        if(!enteredPaswword){
            return res.status(StatusCodes.UNAUTHORIZED).json({status:FAIL, message: 'Authentication Error'})
        };
        const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_TOKEN, {expiresIn: '1h'})
        user.token = token
        res.status(StatusCodes.OK).json({status: SUCCESS, token})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:ERROR, message: error.message})
    }
}
const signoutUser = async(req, res) => {
    try {
        const userId = req.params.id;
        const user = userModel.findByIdAndUpdate(userId, {isActive: false});
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({status:FAIL, message: 'User not found'});
        }
        res.status(StatusCodes.OK).json({status: SUCCESS, message: 'user logged out successfully'})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: ERROR, message: error.message})
    }
}
export {
    signupUser,
    signinUser,
    signoutUser
}