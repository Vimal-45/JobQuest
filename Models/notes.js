 import { ObjectId } from "mongodb";
import mongoose from "mongoose";


 const noteSchema = new mongoose.Schema({

    companyName: {
        type : String,
        required: true,
    },

    date: {
        type : String,
        required: true,
    },
    role : {
        type : String,
        required: true,
    },
    package: String,
    questions:{
        type : Array,
        required: true,
    }, 
    user : {
        type : ObjectId,
        ref:'user'
    },

  
 })
 
 const Notes = mongoose.model('notes', noteSchema);
 export default Notes;