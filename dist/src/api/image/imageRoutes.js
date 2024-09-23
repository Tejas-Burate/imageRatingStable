"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageController_1 = require("./imageController");
const router = express_1.default.Router();
router.post("/createImage", imageController_1.createImage);
router.get("/getAllImage", imageController_1.getAllImage);
router.get("/getImageById/:id", imageController_1.getImageById);
router.put("/updateImageById/:id", imageController_1.updateImageById);
router.delete("/deleteImageById/:id", imageController_1.deleteImageById);
exports.default = router;
