import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
    {
        subscriptionTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionType", required: true },
        planName: { type: String, required: true },
        price: { type: Number, required: true },
        duration: { type: Number, required: true },
        quizAllowed: { type: Number, required: false },
        benefits: [{ type: String, required: true }]
    },
    { timestamps: true }
);

export default mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
