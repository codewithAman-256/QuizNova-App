import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`🟢 MongoDB Connected ${conn.connection.host}`);

        const result = await Quiz.updateMany({}, [
        { $set: { difficulty: { $toLower: "$difficulty" } } },
        ]);

        console.log(`✅ Updated ${result.modifiedCount} quizzes to lowercase difficulties.`);
    process.exit();
    } catch(error){
        console.error(`❌ Error : ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;

