"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const authSchema = new mongoose_1.default.Schema({
    fullName: { type: String, required: false },
    email: { type: String, required: [true, "Email is required"], unique: true },
    emailVerified: { type: Boolean, required: false, default: false },
    mobileNo: { type: Number, required: false },
    password: { type: String, required: false },
    roleId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Role", required: false, default: "66b9f484363dda52ed6fd2c9" },
    dob: { type: String, required: false },
    gender: { type: String, required: false },
    country: { type: String, required: true },
    profileImg: { type: String, required: false, default: null },
    token: { type: String, required: false, default: null },
    deviceRegistrationToken: { type: String, required: false, default: null },
    googleAuthId: { type: String, required: false },
    preferences: { type: Array, required: false },
    existingUser: { type: Boolean, required: false },
    subscription: { type: Boolean, required: true, default: false }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Auth", authSchema);
