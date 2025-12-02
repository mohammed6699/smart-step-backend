import mongoose from "mongoose";
import wordsCategories from "../configs/words.category.js";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: [wordsCategories.BODYPARTS, wordsCategories.BIRDS, wordsCategories.ANIMALS],
        default: wordsCategories.ANIMALS
    },
    description: {
        type: String,
    },
    iconPath: {
        type: String,
    }
},{
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v
        }
    },
    timestamps: true
});
const categoryModel = mongoose.model('categoryModel', categorySchema);
export default categoryModel