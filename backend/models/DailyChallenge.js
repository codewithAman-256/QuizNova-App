import mongoose from "mongoose";

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: String, required: true },  // <-- FIXED
  quizId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Quiz",
    required:true
  }
}, { timestamps: true });

export default mongoose.model("DailyChallenge", dailyChallengeSchema);
