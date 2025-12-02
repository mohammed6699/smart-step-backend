import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const databaseConnection = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('data base connected');
        })
        await mongoose.connect(`${process.env.DATABASE_URL}/smartStep`);
    } catch (error) {
        console.log('error connected to data base', error.message)
    }
}
export default databaseConnection;