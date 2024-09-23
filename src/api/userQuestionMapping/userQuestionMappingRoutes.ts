import express from "express"
import { createUserQuestionMapping, getAllUserQuestionMapping, getUserQuestionMappingById, getCategoryStatistics, getCategoryPoints, updateUserQuestionMappingById, deleteUserQuestionMappingById, getSubmittedQuestions, getRecentQuizs } from "./userQuestionMappingController"

const router = express.Router()

router.post("/createUserQuestionMapping", createUserQuestionMapping)
router.get("/getAllUserQuestionMapping", getAllUserQuestionMapping)
router.get("/getUserQuestionMappingById/:id", getUserQuestionMappingById)
router.get("/getCategoryStatistics/:id", getCategoryStatistics)
router.get("/getCategoryPoints/:id", getCategoryPoints)
router.put("/updateUserQuestionMappingById/:id", updateUserQuestionMappingById)
router.delete("/deleteUserQuestionMappingById/:id", deleteUserQuestionMappingById)
router.get("/getRecentQuizs/:id", getRecentQuizs)
router.post("/getSubmittedQuestions", getSubmittedQuestions);
export default router;