"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema for tracking user interactions with questions
const userQuizQuestionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    questionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "QuizQuestion",
        required: true,
    },
    quizId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "QuizCompetition",
        required: true,
    },
    sessionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("UserQuizQuestion", userQuizQuestionSchema);
