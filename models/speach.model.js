import mongoose from "mongoose";

const speechSchema = new mongoose.Schema({
    child:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    audioFilePat: {
        type: String,
        required: true
    },
    analysisResult: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
},{
    toJSON:{
        transform: (doc, ret) => {
            delete ret.__v
        }
    }
});
const speechModel = mongoose.model('speechModel', speechSchema);
export default speechModel;