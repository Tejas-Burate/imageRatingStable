import mongoose, { Document, Schema } from "mongoose";

// Define the schema for tracking user interactions with questions
const userQuestionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuestionCategory",
            required: true,
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },
        answer: {
            type: String,
            required: false,
        },
        isCorrect: {
            type: Boolean,
            required: false,
        },
        timeTaken: {
            type: Number, // Store the time taken to solve the question in seconds
            required: false,
        },
        status: {
            type: String,
            required: true, // Tracks the number of attempts the user made for this question
        },
        attempts: {
            type: Number,
            default: 1, // Tracks the number of attempts the user made for this question
        }
    },
    { timestamps: true }
);

export default mongoose.model("UserQuestion", userQuestionSchema);
