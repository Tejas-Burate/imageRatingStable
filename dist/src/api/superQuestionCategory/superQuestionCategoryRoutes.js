"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const superQuestionCategoryController_1 = require("./superQuestionCategoryController");
const router = express_1.default.Router();
router.post("/createSuperQuestionCategory", superQuestionCategoryController_1.createSuperQuestionCategory);
router.get("/getAllSuperQuestionCategory", superQuestionCategoryController_1.getAllSuperQuestionCategory);
router.get("/getSuperQuestionCategoryById/:id", superQuestionCategoryController_1.getSuperQuestionCategoryById);
router.post("/setSuperQuestionCategory", superQuestionCategoryController_1.setSuperQuestionCategory);
router.post("/getSuperQuestionCategoryFilters", superQuestionCategoryController_1.getSuperQuestionCategoryFilters);
router.put("/updateSuperQuestionCategoryById/:id", superQuestionCategoryController_1.updateSuperQuestionCategoryById);
router.delete("/deleteSuperQuestionCategoryById/:id", superQuestionCategoryController_1.deleteSuperQuestionCategoryById);
exports.default = router;
