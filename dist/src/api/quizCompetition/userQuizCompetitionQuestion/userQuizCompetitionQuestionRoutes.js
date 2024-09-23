"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userQuizCompetitionQuestionController_1 = require("./userQuizCompetitionQuestionController");
const router = express_1.default.Router();
router.get("/getAllUserQuizCompetitionQuestion", userQuizCompetitionQuestionController_1.getAllUserQuizCompetitionQuestion);
router.post("/getTopFiveResult", userQuizCompetitionQuestionController_1.getTopFiveResult);
router.post("/getQuizCompetitionResultByUser", userQuizCompetitionQuestionController_1.getQuizCompetitionResultByUser);
router.get("/getUserQuizCompetitionQuestionById/:id", userQuizCompetitionQuestionController_1.getUserQuizCompetitionQuestionById);
exports.default = router;
