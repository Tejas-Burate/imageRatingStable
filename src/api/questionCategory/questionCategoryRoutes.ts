import express from "express"
import { createQuestionCategory, getQuestionCategoryFilters, getAllQuestionCategory, getAllMinorQuestionCategoryByUserId, getQuestionCategoryById, updateQuestionCategoryById, deleteQuestionCategoryById } from "./questionCategoryController"

const router = express.Router()

router.post("/createQuestionCategory", createQuestionCategory)
router.get("/getAllQuestionCategory", getAllQuestionCategory)
router.get("/getQuestionCategoryById/:id", getQuestionCategoryById)
router.post("/getQuestionCategoryFilters", getQuestionCategoryFilters)
router.get("/getAllMinorQuestionCategoryByUserId/:id", getAllMinorQuestionCategoryByUserId)
router.put("/updateQuestionCategoryById/:id", updateQuestionCategoryById)
router.delete("/deleteQuestionCategoryById/:id", deleteQuestionCategoryById)

export default router;