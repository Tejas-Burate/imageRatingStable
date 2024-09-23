"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionCategoryController_1 = require("./questionCategoryController");
const router = express_1.default.Router();
router.post("/createQuestionCategory", questionCategoryController_1.createQuestionCategory);
router.get("/getAllQuestionCategory", questionCategoryController_1.getAllQuestionCategory);
router.get("/getQuestionCategoryById/:id", questionCategoryController_1.getQuestionCategoryById);
router.post("/getQuestionCategoryFilters", questionCategoryController_1.getQuestionCategoryFilters);
router.get("/getAllMinorQuestionCategoryByUserId/:id", questionCategoryController_1.getAllMinorQuestionCategoryByUserId);
router.put("/updateQuestionCategoryById/:id", questionCategoryController_1.updateQuestionCategoryById);
router.delete("/deleteQuestionCategoryById/:id", questionCategoryController_1.deleteQuestionCategoryById);
exports.default = router;
