import express from "express"
import { createSetting, getAllSetting, getSettingById, updateSettingById, deleteSettingById } from "./settingController"

const router = express.Router()

router.post("/createSetting", createSetting)
router.get("/getAllSetting", getAllSetting)
router.get("/getSettingById/:id", getSettingById)
router.put("/updateSettingById/:id", updateSettingById)
router.delete("/deleteSettingById/:id", deleteSettingById)

export default router;