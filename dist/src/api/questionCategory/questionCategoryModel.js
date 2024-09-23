"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionCategorySchema = new mongoose_1.default.Schema({
    categoryName: { type: String, required: false },
    orgImgUrl: { type: String, required: true },
    compImgUrl: { type: String, required: true },
    // superCategoryId: [{ type: Schema.Types.ObjectId, ref: "SuperQuestionCategory" }],
    isActive: { type: String, required: true, default: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("QuestionCategory", questionCategorySchema);
