"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleController_1 = require("./roleController");
const router = express_1.default.Router();
router.post("/createRole", roleController_1.createRole);
router.get("/getAllRole", roleController_1.getAllRole);
router.get("/getRoleById/:id", roleController_1.getRoleById);
router.put("/updateRoleById/:id", roleController_1.updateRoleById);
router.delete("/deleteRoleById/:id", roleController_1.deleteRoleById);
exports.default = router;
