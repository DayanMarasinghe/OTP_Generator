import mongoose from 'mongoose';

const {Schema, ObjectId} = mongoose;

const studentSchema = new Schema({
    name:{
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
    contactNumber:{
        type: String,
        trim: true,
        required: true
    },

    login : {type: ObjectId,ref : "Login"},

},{timestamps:true});

export default mongoose.model('Student',studentSchema);