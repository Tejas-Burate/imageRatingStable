"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminPanelController_1 = require("./adminPanelController");
const router = express_1.default.Router();
router.get("/mostTrendingCategory", adminPanelController_1.mostTrendingCategory);
router.get("/userRegistrationStatistics", adminPanelController_1.userRegistrationStatistics);
router.get("/difficultyLevelStatisticsByCategory/:id", adminPanelController_1.difficultyLevelStatisticsByCategory);
router.post("/updateQuestionOwnerInBulk", adminPanelController_1.updateQuestionOwnerInBulk);
router.post("/updateSelectedQuestionsQuestionOwner", adminPanelController_1.updateSelectedQuestionsQuestionOwner);
exports.default = router;
