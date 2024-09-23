"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RatingSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId, // Correctly define the type
        ref: "Auth", // Reference to the Auth collection
        required: false, // Since it's optional
    },
    imageId: {
        type: mongoose_1.default.Schema.Types.ObjectId, // Correctly define the type
        ref: "Image", // Reference to the Image collection
        required: true, // Ensure imageId is required
    },
    rating: {
        type: Number,
        required: true, // Rating is required
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Rating", RatingSchema);
