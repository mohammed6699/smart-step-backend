import mongoose from "mongoose";
import userRole from "../configs/user.role.js";
import { hashSync } from "bcryptjs";

const userSchmea = new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        maxlength: 30
    },
    lastname:{
        type: String,
        required: true,
        maxlength: 30
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Invalid email format"]
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    media: {
        type: String
    },
    role: {
        type: String,
        enum: [userRole.ADMIN, userRole.USER],
        default: userRole.USER
    },
    isActive: {
        type: Boolean,
        default: true,
    }
},
{
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.__v;
        }
    }
});
userSchmea.pre('save', function(next){
    if(!this.isModified('password')) return next();
    this.password = hashSync(this.password, 10);
    next();
});
const userModel = mongoose.model('userModel', userSchmea);
export default userModel;