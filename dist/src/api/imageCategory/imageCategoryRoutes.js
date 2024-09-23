"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageCategoryController_1 = require("./imageCategoryController");
const router = express_1.default.Router();
router.post("/createImageCategory", imageCategoryController_1.createImageCategory);
router.get("/getAllImageCategory", imageCategoryController_1.getAllImageCategory);
router.get("/getImageCategoryById/:id", imageCategoryController_1.getImageCategoryById);
router.put("/updateImageCategoryById/:id", imageCategoryController_1.updateImageCategoryById);
router.delete("/deleteImageCategoryById/:id", imageCategoryController_1.deleteImageCategoryById);
exports.default = router;
