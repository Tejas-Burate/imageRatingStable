import mongoose, { Document, Schema } from "mongoose";


const tagSchema: Schema = new mongoose.Schema(
    {
        tagName: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("tag", tagSchema);
