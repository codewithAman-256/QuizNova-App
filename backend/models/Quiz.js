import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        question:{type:String, required:true},
        options:[{type:String, required:true}],
        correctAnswer:{type:String,required:true},
        category:{type:String,required:true},
        difficulty:{
            type:String,
            enum:["Easy","Medium","Hard"],
            default:"Easy",
        },
    },
    {timestamps:true}
);

const Quiz = mongoose.model("Quiz",quizSchema);
export default Quiz;