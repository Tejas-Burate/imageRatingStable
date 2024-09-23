"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageUploadController_1 = require("./imageUploadController");
const router = express_1.default.Router();
router.post("/imgUpload", imageUploadController_1.upload.single("file"), imageUploadController_1.imgUpload);
exports.default = router;
