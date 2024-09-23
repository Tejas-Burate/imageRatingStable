"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settingSchema = new mongoose_1.default.Schema({
    settingName: {
        type: String,
    },
    correctAnswerPoints: {
        type: Number,
        default: 10,
    },
    noOfQuizQuestions: {
        type: Number,
        default: 10,
    },
    questionTime: {
        type: Number,
        default: 1800,
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Setting", settingSchema);
