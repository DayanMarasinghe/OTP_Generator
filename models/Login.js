import mongoose from 'mongoose';

const {Schema, ObjectId} = mongoose;

const loginSchema = new Schema({
    role:{
        type: String,
        trim: true,
        required: true
    },
    username:{
        type:String,
        trim:true,
        required: true,
        unique: true
    },
    password:{
        type:String,
        trim:true,
    },
    student : {type: ObjectId,ref : "Student"},
},{timestamps:true});

export default mongoose.model('Login',loginSchema);