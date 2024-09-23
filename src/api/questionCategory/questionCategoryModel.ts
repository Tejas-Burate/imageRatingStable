import mongoose, { Document, Schema } from "mongoose";



const questionCategorySchema: Schema = new mongoose.Schema(
  {
    categoryName: { type: String, required: false },
    orgImgUrl: { type: String, required: true },
    compImgUrl: { type: String, required: true },
    // superCategoryId: [{ type: Schema.Types.ObjectId, ref: "SuperQuestionCategory" }],
    isActive: { type: String, required: true, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("QuestionCategory", questionCategorySchema);
