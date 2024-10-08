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
const rzpResponseDataSchema = new mongoose_1.default.Schema({
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
}, { _id: false });
const orderSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Auth", required: true },
    planId: { type: mongoose_1.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    typeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "SubscriptionType", required: true },
    rzpResponseData: { type: rzpResponseDataSchema, required: true },
    orderStatus: { type: String, required: true },
    paymentStatus: { type: String, required: true, default: "pending" },
    amount: { type: String, required: true },
    currency: { type: String, required: true }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Order", orderSchema);
