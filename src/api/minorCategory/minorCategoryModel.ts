import mongoose, { Document, Schema } from "mongoose";



const minorCategorySchema: Schema = new mongoose.Schema(
  {
    superCategoryId: [{ type: Schema.Types.ObjectId, ref: "SuperQuestionCategory" }],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionCategory",
      required: true,
    },
    isActive: { type: String, required: true, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("minorCategory", minorCategorySchema);
