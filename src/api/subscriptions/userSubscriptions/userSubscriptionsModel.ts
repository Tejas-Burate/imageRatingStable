import mongoose from "mongoose";

const userSubscriptionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
        planId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
        typeId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionType", required: true },
        subscriptionType: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String, required: true, enum: ['active', 'inactive', 'expired'] },
        razorpayOrderId: { type: String, required: true },
        razorpayPaymentId: { type: String, required: true },
        razorpaySignature: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("UserSubscription", userSubscriptionSchema);
