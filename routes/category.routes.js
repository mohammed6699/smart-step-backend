import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/category.controller.js';
import { upload } from '../configs/multer.js';

const categoryRouter = express.Router();

categoryRouter.get('/allcategories', getAllCategories);
categoryRouter.get('/allcategories/:id', getCategoryById);
categoryRouter.post('/newcategory', upload.single('iconPath'),createCategory);
categoryRouter.patch('/updatecategory/:id', updateCategory);
categoryRouter.delete('/deletecategory/:id', deleteCategory);
export default categoryRouter;