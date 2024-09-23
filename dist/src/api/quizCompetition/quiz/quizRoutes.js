"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quizController_1 = require("./quizController");
const router = express_1.default.Router();
router.post("/createQuiz", quizController_1.createQuiz);
router.get("/getQuizById/:id", quizController_1.getQuizById);
router.get("/getAllQuiz", quizController_1.getAllQuiz);
router.post("/getQuizFilters", quizController_1.getQuizFilters);
router.put("/updateQuizById/:id", quizController_1.updateQuizById);
router.put("/deleteQuizById/:id", quizController_1.deleteQuizById);
exports.default = router;
