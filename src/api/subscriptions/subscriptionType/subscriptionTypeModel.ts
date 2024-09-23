import mongoose, { Document, Schema } from "mongoose";


const subscriptionTypeSchema = new mongoose.Schema(
    {
        subscriptionType: { type: String, required: true },
        description: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("SubscriptionType", subscriptionTypeSchema);
