"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Auth", required: true },
    categoryId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "QuestionCategory", required: true },
    questionCount: { type: Number, required: true, default: 0 },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Session", sessionSchema);
