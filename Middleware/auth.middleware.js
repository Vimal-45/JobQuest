import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../Models/user.js'
dotenv.config()

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        if (token) {            
            const decode = jwt.verify(token, process.env.SECRETKEY);          
            req.user = await User.findById(decode._id).select("_id username email")
            // console.log(req.user);
            next();
            
        }
        else
        {
            return res.status(400).json({ error: 'invalid token' })
        }

    } catch (error) {
        console.log('Auth middleware Error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default authMiddleware;