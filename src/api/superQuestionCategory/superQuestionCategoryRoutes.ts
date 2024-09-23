import express from "express"
import { createSuperQuestionCategory, getAllSuperQuestionCategory, getSuperQuestionCategoryFilters, getSuperQuestionCategoryById, updateSuperQuestionCategoryById, deleteSuperQuestionCategoryById, setSuperQuestionCategory } from "./superQuestionCategoryController"

const router = express.Router()

router.post("/createSuperQuestionCategory", createSuperQuestionCategory)
router.get("/getAllSuperQuestionCategory", getAllSuperQuestionCategory)
router.get("/getSuperQuestionCategoryById/:id", getSuperQuestionCategoryById)
router.post("/setSuperQuestionCategory", setSuperQuestionCategory)
router.post("/getSuperQuestionCategoryFilters", getSuperQuestionCategoryFilters)
router.put("/updateSuperQuestionCategoryById/:id", updateSuperQuestionCategoryById)
router.delete("/deleteSuperQuestionCategoryById/:id", deleteSuperQuestionCategoryById)

export default router;