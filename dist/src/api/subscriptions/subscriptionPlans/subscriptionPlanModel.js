"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionPlanSchema = new mongoose_1.default.Schema({
    subscriptionTypeId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "SubscriptionType", required: true },
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    quizAllowed: { type: Number, required: false },
    benefits: [{ type: String, required: true }]
}, { timestamps: true });
exports.default = mongoose_1.default.model("SubscriptionPlan", subscriptionPlanSchema);
