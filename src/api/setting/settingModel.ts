import mongoose, { Document, Schema } from "mongoose";

const settingSchema = new mongoose.Schema(
    {
        settingName: {
            type: String,
        },
        correctAnswerPoints: {
            type: Number,
            default: 10,
        },
        noOfQuizQuestions: {
            type: Number,
            default: 10,
        },
        questionTime: {
            type: Number,
            default: 1800,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);
