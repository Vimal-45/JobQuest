import mongoose from "mongoose";
import dotev from 'dotenv'

dotev.config()

const dbConnection = () => {

    try {
        const mongoURL = process.env.MONGOCONNECTION
        mongoose.set('debug', true);
        const connection = mongoose.connect(mongoURL)
        console.log("Data base connection sucessfully");
        return connection;
    } catch (error) {
        console.log('mongoDB connect Error:', error);
    }

}

export default dbConnection;