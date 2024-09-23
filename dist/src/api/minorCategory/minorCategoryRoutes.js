"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const minorCategoryController_1 = require("./minorCategoryController");
const router = express_1.default.Router();
router.post("/createMinorCategory", minorCategoryController_1.createMinorCategory);
router.get("/getAllMinorCategory", minorCategoryController_1.getAllMinorCategory);
router.get("/getMinorCategoryById/:id", minorCategoryController_1.getMinorCategoryById);
router.get("/getMinorCategoryByCategoryId/:categoryId", minorCategoryController_1.getMinorCategoryByCategoryId);
router.put("/updateMinorCategoryById/:id", minorCategoryController_1.updateMinorCategoryById);
router.delete("/deleteMinorCategoryById/:id", minorCategoryController_1.deleteMinorCategoryById);
exports.default = router;
