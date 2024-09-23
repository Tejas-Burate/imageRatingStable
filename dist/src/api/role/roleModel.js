"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoleSchema = new mongoose_1.default.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: [
        {
            serviceName: {
                type: String,
                required: true,
            },
            apis: [
                {
                    api: {
                        type: String,
                        required: true,
                    },
                    methods: [
                        {
                            type: String,
                            enum: ["GET", "POST", "PUT", "DELETE"],
                        },
                    ],
                    allowed: {
                        type: Boolean,
                        default: false,
                    },
                },
            ],
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Role", RoleSchema);
