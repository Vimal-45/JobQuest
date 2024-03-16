import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

        username: {
            type :String,
            required:true,
            trim:true,
        },

        password:{
            type :String,
            required:true,
            trim:true,
           
        },

        email:{
            type :String,
            required:true,
            trim:true,
            unique:true
        },
        imageUrl:{
            type :String,           
            trim:true,
            
        }

})

const User = mongoose.model('user',userSchema);
export default User;