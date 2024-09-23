import express from "express"
import { createLog, getAllLog, getLogById, updateLogById, deleteLogById } from "./logController"

const router = express.Router()

router.post("/createLog", createLog)
router.get("/getAllLog", getAllLog)
router.get("/getLogById/:id", getLogById)
router.put("/updateLogById/:id", updateLogById)
router.delete("/deleteLogById/:id", deleteLogById)

export default router;