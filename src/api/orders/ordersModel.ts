import mongoose, { Document, Schema } from "mongoose";

const rzpResponseDataSchema = new mongoose.Schema({
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
}, { _id: false });

const orderSchema: Schema = new mongoose.Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
        planId: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
        // typeId: { type: Schema.Types.ObjectId, ref: "SubscriptionType", required: true },
        rzpResponseData: { type: rzpResponseDataSchema, required: true },
        orderStatus: { type: String, required: true },
        paymentStatus: { type: String, required: true, default: "pending" },
        amount: { type: String, required: true },
        currency: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
