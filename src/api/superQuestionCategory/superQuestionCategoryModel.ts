import mongoose, { Document, Schema } from "mongoose";



const superQuestionCategorySchema: Schema = new mongoose.Schema(
  {
    superCategoryName: { type: String, required: false },
    questionCategories: [{ type: Schema.Types.ObjectId, ref: "QuestionCategory" }],
    orgImgUrl: { type: String, required: true },
    compImgUrl: { type: String, required: true },
    isActive: { type: String, required: true, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("SuperQuestionCategory", superQuestionCategorySchema);
