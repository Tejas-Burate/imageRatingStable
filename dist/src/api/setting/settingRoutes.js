"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingController_1 = require("./settingController");
const router = express_1.default.Router();
router.post("/createSetting", settingController_1.createSetting);
router.get("/getAllSetting", settingController_1.getAllSetting);
router.get("/getSettingById/:id", settingController_1.getSettingById);
router.put("/updateSettingById/:id", settingController_1.updateSettingById);
router.delete("/deleteSettingById/:id", settingController_1.deleteSettingById);
exports.default = router;
