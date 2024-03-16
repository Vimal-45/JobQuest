import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import cryptoRandomString from 'crypto-random-string'
import User from '../../Models/user.js'
dotenv.config()




export const emailSender = async (req, res) => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "vimalfsd@gmail.com",
            pass: 'gcoydoxcahzrkqon',
        },
    });
    console.log(req.body);
    const { email } = req.body;
        
    try {
        const user = await User.findOne({ email });
        if (!user) {
          
            return res.status(404).json({ message: 'User not found' });
        }        
       
        const randomString = cryptoRandomString({ length: 32 });
      

              
        const resetLink = `http://localhost:3000/reset?string=${randomString}`;    

        const emailDetails = {
            from: "vimalfsd@gmail.com",
            to: email,
            subject: 'Password Reset',
            text: `Click on this link to reset your password:${resetLink}`,
        };

        transporter.sendMail(emailDetails, (error) => {
            if (error) {
                return res.status(500).json({ message: 'Email not sent' });
            }
            return res.status(200).json({ message: 'Password reset link sent your Email', randomString:randomString});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

   
}



