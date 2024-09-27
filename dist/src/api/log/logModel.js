"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Auth" },
    method: { type: String, required: true },
    statusCode: { type: String, required: true },
    url: { type: String, required: true },
    device: { type: Object, required: true },
    headers: { type: Object, required: true },
    body: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("Log", logSchema);
