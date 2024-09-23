import express from "express"
import { getAllUserQuizCompetitionQuestion, getUserQuizCompetitionQuestionById, getTopFiveResult, getQuizCompetitionResultByUser } from "./userQuizCompetitionQuestionController"

const router = express.Router();

router.get("/getAllUserQuizCompetitionQuestion", getAllUserQuizCompetitionQuestion)
router.post("/getTopFiveResult", getTopFiveResult)
router.post("/getQuizCompetitionResultByUser", getQuizCompetitionResultByUser)
router.get("/getUserQuizCompetitionQuestionById/:id", getUserQuizCompetitionQuestionById)

export default router;