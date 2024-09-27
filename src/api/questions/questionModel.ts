
import mongoose, { Document, Schema } from "mongoose";

// Define the Option schema
const optionSchema = new Schema({
    optionValue: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
}, { _id: true });
const questionSchema = new Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuestionCategory",
            required: true,
        },
        question: { type: String, required: true },
        questionTime: { type: String, required: false },
        orgImgUrl: { type: String, required: false },
        compImgUrl: { type: String, required: false },
        optionList: { type: [optionSchema], required: true }, // Use the optionSchema here
        difficultyLevel: { type: Number, required: true },
        country: { type: String, required: false },
        globalView: { type: Boolean, required: false },
        questionCreator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: false,
        },
        questionOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
