import mongoose, { Document, Schema } from "mongoose";

const userSuperQuestionCategorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        },
        superQuestionCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SuperQuestionCategory",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("UserSuperQuestionCategory", userSuperQuestionCategorySchema);
