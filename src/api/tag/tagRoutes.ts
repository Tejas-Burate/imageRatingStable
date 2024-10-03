import express from "express"
import {
    createTag,
    getTagById,
    getAllTag,
    getTagFilters,
    updateTagById,
    deleteTagById,
} from "./tagController"

const router = express.Router();

router.get("/getAllTag", getAllTag)
router.post("/createTag", createTag)
router.post("/getTagFilters", getTagFilters)
router.get("/getTagById/:id", getTagById)
router.put("/updateTagById/:id", updateTagById)
router.delete("/deleteTagById/:id", deleteTagById)

export default router;