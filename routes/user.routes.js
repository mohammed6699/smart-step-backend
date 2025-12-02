import express from 'express';
import { upload } from '../configs/multer.js';
import { signinUser, signoutUser, signupUser } from '../controllers/register.controller.js';

const userRouter = express.Router();

userRouter.post('/signup', upload.single('media'), signupUser);
userRouter.post('/login', signinUser);
userRouter.post('/signout/:id', signoutUser);
export default userRouter;