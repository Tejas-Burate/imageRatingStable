import express from "express"
import { createSession, getAllSession, getSessionById, updateSessionById, deleteSessionById } from "./sessionController"

const router = express.Router()

router.post("/createSession", createSession)
router.get("/getAllSession", getAllSession)
router.get("/getSessionById/:id", getSessionById)
router.put("/updateSessionById/:id", updateSessionById);

export default router;