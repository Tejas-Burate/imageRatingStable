"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSubscriptionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Auth", required: true },
    planId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    // typeId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionType", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ['active', 'inactive', 'expired'] },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    razorpaySignature: { type: String, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("UserSubscription", userSubscriptionSchema);
