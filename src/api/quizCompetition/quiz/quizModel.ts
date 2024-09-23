
import mongoose from "mongoose";

const quizCompetitionSchema = new mongoose.Schema({
    quizName: { type: String, required: true },
    quizDescription: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    pointsPerQuestions: { type: Number, required: true },
    quizTime: { type: String, required: true },
    quizStartDateAndTime: { type: Date, required: true },
    registrationStartDate: { type: Date, required: true },
    registrationEndDate: { type: Date, required: true },
    isActive: { type: Boolean, required: true, default: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("QuizCompetition", quizCompetitionSchema);