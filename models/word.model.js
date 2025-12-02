import mongoose from "mongoose";
const wordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    imagePath: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categoryModel',
        default: null
    },
    model3DPath:{
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v
        }
    },
    timestamps: true
});
const wordsModel = mongoose.model('wordsModel', wordSchema);
export default wordsModel;