import mongoose, { Document, Schema } from "mongoose";


const competitionSessionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizCompetition", required: true },
        questionCount: { type: Number, required: true, default: 0 },
        sessionStatus: { type: String, required: true, default: "Running" }
    },
    { timestamps: true }
);

export default mongoose.model("CompetitionSession", competitionSessionSchema);
