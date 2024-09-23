import express from 'express';
import { createQuiz, getQuizById, getAllQuiz, updateQuizById, getQuizFilters, deleteQuizById } from "./quizController";

const router = express.Router();

router.post("/createQuiz", createQuiz);
router.get("/getQuizById/:id", getQuizById);
router.get("/getAllQuiz", getAllQuiz);
router.post("/getQuizFilters", getQuizFilters);
router.put("/updateQuizById/:id", updateQuizById);
router.put("/deleteQuizById/:id", deleteQuizById);

export default router;
