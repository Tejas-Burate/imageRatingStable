"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quizCompetitionSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("QuizCompetition", quizCompetitionSchema);
