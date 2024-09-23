import express from "express"
import { createMinorCategory, getAllMinorCategory, getMinorCategoryByCategoryId, getMinorCategoryById, updateMinorCategoryById, deleteMinorCategoryById } from "./minorCategoryController"

const router = express.Router()

router.post("/createMinorCategory", createMinorCategory)
router.get("/getAllMinorCategory", getAllMinorCategory)
router.get("/getMinorCategoryById/:id", getMinorCategoryById)
router.get("/getMinorCategoryByCategoryId/:categoryId", getMinorCategoryByCategoryId)
router.put("/updateMinorCategoryById/:id", updateMinorCategoryById)
router.delete("/deleteMinorCategoryById/:id", deleteMinorCategoryById)

export default router;