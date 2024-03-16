import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import User from "../Models/user.js";
import dotenv from 'dotenv'
import Notes from "../Models/notes.js";

dotenv.config()

// user signup------------------------------------------
export const userRegistration = async (req, res) => {

      
   
    try {

        const { username, password, email } = req.body;
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({
                Error: "User already exist"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, email: email, password: hashPassword })
        await newUser.save();
        res.status(201).json({ message: `User ${username} sucessfully register` })

    } catch (error) {
        console.log('UserRegistration controller Error', error);
        res.status(500).json({ error: 'Internal server error' })
    }

}


//user login-------------------------------------------------
export const userLogin = async (req, res) => {
    try {

        const { password, email } = req.body;
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                error: "Invalid user"
            })
        }

        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return res.status(404).json({ error: 'Invalid Password' })
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRETKEY)
        
        res.status(200).json({ message: 'Logged in Sucessfully', token:token })
    } catch (error) {
        console.log('UserLogin controller Error', error);
        res.status(500).json({ error: 'Internal server error' })
    }



}

// Get All Notes ---------------------------------

export const getAllNotes = async (req, res) => {
    try {

        
        const notes = await Notes.find().populate('user', 'username imageUrl email')
        if (notes.length <= 0) {
            res.status(404).json({
                error: 'No data found'
            });
        } else {
            const userId = req.user._id
            // console.log(userId);
            const user = await User.findById(userId)
            // console.log(user);
          
            res.status(200).json({ data: notes, user });
        }


    } catch (error) {
        console.log('getAllNotes controller Error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get only user data--------------------------
export const getUserNotes = async (req, res) => {
    try {
        const notes = await Notes.find({user:req.user._id}).populate('user','username imageUrl email')

        if (notes.length <= 0) {
            res.status(404).json({
                error: 'No data found'
            });
        } else {
            res.status(200).json({ data: notes });
        }

    } catch (error) {
        console.log('getUserNotes controller Error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// user add notes--------------------------

export const userAddNotes = async (req, res) => {
   
    try {
        const date = new Date().toJSON().slice(0, 10)       
        const decode = jwt.verify(req.body.token, process.env.SECRETKEY);          
        const userID = await User.findById(decode._id).select("_id username email")
        delete req.body.token
        const newNotes = new Notes({ ...req.body, date: date, user: userID })
        if (!newNotes) {
            return res.status(400).json({ error: "Notes data upload failed" })
        } else {
            newNotes.save()
            return res.status(201).json({ message: "Notes saved succesfully", data: newNotes })
        }
    } catch (error) {
        console.log('userAddNotes controller Error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Notes update-------------------------------------

export const updateNotes = async (req, res) => {
    try {
        const noteUpdation = await Notes.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })

        if (!noteUpdation) {
            return res.status(400).json({ error: "Notes update failed" })
        } else {
            // console.log(noteUpdation);
            const notes = await Notes.find({user:req.user._id}).populate('user','username email')
            return res.status(201).json({ message: "Notes update succesfully", data: notes })
        }
    } catch (error) {
        console.log('updateNotes controller Error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


//Delete notes ------------------------------------------

export const deleteNotes = async (req, res) => {
            
    try {
        const deletedCount = await Notes.findByIdAndDelete({ _id: req.params.id })
         if (!deletedCount) {
            return res.status(400).json({error: "note not deleted"})
         } else {
            
            return res.status(200).json({message:"Notes deleted succesfully"})
         }   
    } catch (error) {
        console.log('deleteNotes controller Error', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

export const resetPassword = async (req, res) => {
    try {

        const hashpassword = await bcrypt.hash(req.body.password, 10)
       
        const user = await User.findOne({ email:req.body.email })
        
        if (!user) {
            res.status(200).json({ message: 'User not found' });
            return res.status(404).json({ message: 'User not found' });
        }
        const result = await User.updateOne({ email: user.email }, { password: hashpassword })

        if (result.matchedCount === 0) {
            res.status(200).json({ message: 'user not matched' })
            return res.status(401).json({ message: 'user not matched' })
        }
        res.status(200).json({ message: 'password updated sucessfully' })

    } catch (error) {
        console.log('error in resetpassword section', error);
    }


}

export  const updateUser = async(req, res) =>{
    try {
        const userId = req.user._id
        const userUpdation = await User.findOneAndUpdate({ _id: userId}, { $set: req.body }, { new: true })

        if (!userUpdation) {
            return res.status(400).json({ error: "User update failed" })
        } else {
            console.log(userUpdation)  
            return res.status(201).json({ message: "User details update succesfully", data: userUpdation })
        }
    } catch (error) {
        console.log('updateNotes controller Error', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}