import mongoose from "mongoose";

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  question: String,
  options: [String], 
  correctAnswer: String,
  difficulty: String,
}, { timestamps: true });


const DailyChallenge = mongoose.model("DailyChallenge",dailyChallengeSchema);
export default DailyChallenge;