import mongoose, { Document, Schema } from "mongoose";


const sessionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionCategory", required: true },
        questionCount: { type: Number, required: true, default: 0 },
        sessionStatus: { type: String, required: true, default: "Running" }
    },
    { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
