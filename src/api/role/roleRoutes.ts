import express from "express"
import {createRole,getAllRole,getRoleById,updateRoleById,deleteRoleById} from "./roleController"

const router = express.Router()

router.post("/createRole",createRole)
router.get("/getAllRole",getAllRole)
router.get("/getRoleById/:id",getRoleById)
router.put("/updateRoleById/:id",updateRoleById)
router.delete("/deleteRoleById/:id",deleteRoleById)

export default router;