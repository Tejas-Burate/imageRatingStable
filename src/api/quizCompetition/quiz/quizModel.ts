
import mongoose from "mongoose";

const quizCompetitionSchema = new mongoose.Schema({
    quizName: { type: String, required: true },
    quizDescription: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    pointsPerQuestions: { type: Number, required: true },
    quizStartDateAndTime: { type: Date, required: true },
    quizEndDateAndTime: { type: Date, required: true },
    registrationStartDate: { type: Date, required: false },
    registrationEndDate: { type: Date, required: true },
    isActive: { type: Boolean, required: true, default: true },
    tags: { type: Array, required: true },
},
    { timestamps: true });

export default mongoose.model("QuizCompetition", quizCompetitionSchema);