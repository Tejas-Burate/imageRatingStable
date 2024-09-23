import express from "express";
import { mostTrendingCategory, updateQuestionOwnerInBulk, userRegistrationStatistics, difficultyLevelStatisticsByCategory, updateSelectedQuestionsQuestionOwner } from "./adminPanelController";

const router = express.Router();

router.get("/mostTrendingCategory", mostTrendingCategory);
router.get("/userRegistrationStatistics", userRegistrationStatistics);
router.get("/difficultyLevelStatisticsByCategory/:id", difficultyLevelStatisticsByCategory);
router.post("/updateQuestionOwnerInBulk", updateQuestionOwnerInBulk);
router.post("/updateSelectedQuestionsQuestionOwner", updateSelectedQuestionsQuestionOwner);


export default router