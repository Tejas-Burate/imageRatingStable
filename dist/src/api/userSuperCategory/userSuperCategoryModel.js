"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSuperQuestionCategorySchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    superQuestionCategoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "SuperQuestionCategory",
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("UserSuperQuestionCategory", userSuperQuestionCategorySchema);
