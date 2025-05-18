import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoURL = process.env.MONGO_URL;

const DBConnection = async () => {
    try{
        await mongoose.connect(mongoURL);
        console.log('Connected to DB!');
    } catch (err) {
        console.log('ERROR connecting to DB');
    }
};

export default DBConnection;
