
import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
  method: { type: String, required: true },
  statusCode: { type: String, required: true },
  url: { type: String, required: true },
  device: { type: Object, required: true },
  headers: { type: Object, required: true },
  body: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Log", logSchema);