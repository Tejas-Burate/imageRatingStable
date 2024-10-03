"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tagController_1 = require("./tagController");
const router = express_1.default.Router();
router.get("/getAllTag", tagController_1.getAllTag);
router.post("/createTag", tagController_1.createTag);
router.post("/getTagFilters", tagController_1.getTagFilters);
router.get("/getTagById/:id", tagController_1.getTagById);
router.put("/updateTagById/:id", tagController_1.updateTagById);
router.delete("/deleteTagById/:id", tagController_1.deleteTagById);
exports.default = router;
