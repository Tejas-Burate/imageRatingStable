"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the Option schema
const optionSchema = new mongoose_1.Schema({
    optionValue: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
}, { _id: true });
const questionSchema = new mongoose_1.Schema({
    categoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "QuestionCategory",
        required: true,
    },
    question: { type: String, required: true },
    questionTime: { type: String, required: false },
    orgImgUrl: { type: String, required: false },
    compImgUrl: { type: String, required: false },
    optionList: { type: [optionSchema], required: true }, // Use the optionSchema here
    difficultyLevel: { type: Number, required: true },
    country: { type: String, required: false },
    globalView: { type: Boolean, required: false },
    questionCreator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Auth",
        required: false,
    },
    questionOwner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Auth",
        required: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Question", questionSchema);
